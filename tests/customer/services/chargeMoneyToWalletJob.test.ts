jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import schedule from "node-schedule"
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService";
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { ChargeMoneyToWallet } from "../../../src/bounded_contexts/operations/services/chargeMoneyToWallet/chargeMoneyToWallet"
import { ChargeWalletJob } from "../../../src/bounded_contexts/operations/services/chargeWalletJob/chargeWalletJob"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockPaymentService = new MockPaymentService() as jest.Mocked<MockPaymentService>

const createWallet = new CreateWallet(mockCustomerRepository)
const chargeMoneyToWalletService = new ChargeMoneyToWallet(mockPaymentService)
const chargeWalletJob = new ChargeWalletJob(mockCustomerRepository, chargeMoneyToWalletService)


describe("Charge money to wallet job", () => {
    beforeAll(() => {
        //@ts-ignore
        mockPaymentService.paymentIntent.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
            status: "succeeded",
            client_secret: "client_secret",
            id: "id",
            amount: 0
        }))

    })

    // describe("When the job is scheduled for every day at 00", () => {
    //     beforeAll(async () => {
    //         const job = schedule.scheduleJob({ hour: 0, minute: 0 }, async () => {
    //             await chargeWalletJob.execute({ executionDate: undefined })
    //         })
    //     })
    // })

    describe("Given many customers with wallets", () => {
        let customers: Customer[]
        let jobs: schedule.Job[] | undefined

        beforeAll(async () => {
            const customer_1 = Customer.create(
                CUSTOMER_EMAIL,
                true,
                "",
                [],
                0,
                new Date(),
                undefined,
                undefined,
                CUSTOMER_PASSWORD,
                "active",
                undefined,
                undefined,
                new CustomerId()
            )

            customers = [customer_1]
            for (let i = 0; i < 9; i++) {
                customers.push(Customer.create(
                    CUSTOMER_EMAIL,
                    true,
                    "",
                    [],
                    0,
                    new Date(),
                    undefined,
                    undefined,
                    CUSTOMER_PASSWORD,
                    "active",
                    undefined,
                    undefined,
                    new CustomerId()
                ))
            }

            for (let i = 0; i < 10; i++) {
                const customerPaymentMethod = new PaymentMethod("visa", "4242", 8, 2030, "420", true, "stripe_id")
                customers[i].addPaymentMethod(customerPaymentMethod)
            }

            await mockCustomerRepository.updateMany(customers)

            for (let i = 0; i < 8; i++) {
                await createWallet.execute({ customerId: customers[i].id.toString(), amountToCharge: 27.99, paymentMethodForCharging: customers[i].getDefaultPaymentMethod()?.id.toString()!, datesOfCharge: [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }], locale: Locale.es })
            }

            await createWallet.execute({ customerId: customers[8].id.toString(), amountToCharge: 27.99, paymentMethodForCharging: customers[8].getDefaultPaymentMethod()?.id.toString()!, datesOfCharge: [{ dayNumber: 4, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }], locale: Locale.es })
            await createWallet.execute({ customerId: customers[9].id.toString(), amountToCharge: 27.99, paymentMethodForCharging: customers[9].getDefaultPaymentMethod()?.id.toString()!, datesOfCharge: [{ dayNumber: 2, hour: "13", minute: "45" }, { dayNumber: 4, hour: "17", minute: "30" }], locale: Locale.es })
        })

        describe("When the service runs to schedules the jobs", () => {
            const EXECUTION_DATE = new Date(2045, 7, 21, 0)

            it("Should schedule 8 jobs", async () => {
                jobs = await chargeWalletJob.execute({ executionDate: EXECUTION_DATE })

                expect(jobs?.length).toBe(8)
                for (let i = 0; i < 8; i++) {
                    expect(jobs?.[i].nextInvocation().getHours() ?? "").toEqual(13)
                    expect(jobs?.[i].nextInvocation().getMinutes() ?? "").toEqual(45)
                }
            })

            afterAll(() => {
                for (let i = 0; i < 8; i++) {
                    jobs?.[i].cancel()
                }
            })
        })

        describe("When the jobs runs", () => {

            beforeAll(() => {
                for (let i = 0; i < 8; i++) {
                    jobs?.[i].invoke()
                }
            })

            it("Should charge the money to the wallet", async () => {

                for (let i = 0; i < 9; i++) {
                    const customerDb: Customer = await mockCustomerRepository.findByIdOrThrow(customers[i].id)

                    if (i < 8) expect(customerDb.wallet?.balance).toBe(27.99)
                    else expect(customerDb.wallet?.balance).toBe(0)
                }
            })

        })
    })
})