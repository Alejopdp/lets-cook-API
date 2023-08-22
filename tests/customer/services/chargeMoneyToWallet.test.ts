jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService";
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { ChargeMoneyToWallet } from "../../../src/bounded_contexts/operations/services/chargeMoneyToWallet/chargeMoneyToWallet"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService";

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockPaymentService = new MockPaymentService() as jest.Mocked<MockPaymentService>

const createWallet = new CreateWallet(mockCustomerRepository)
const chargeMoneyToWalletService = new ChargeMoneyToWallet(mockPaymentService)


describe("Charge money to wallet service", () => {
    describe("Given a customer without a wallet", () => {
        const CUSTOMER_ID = new CustomerId()
        let customerPaymentMethod: PaymentMethod;
        let customer: Customer
        const GOOD_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }]
        const DUPLICATED_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 1, hour: "17", minute: "30" }, { dayNumber: 3, hour: "17", minute: "30" }]

        beforeAll(async () => {
            customer = Customer.create(
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
                CUSTOMER_ID
            )

            await mockCustomerRepository.save(customer)
        })

        describe("When it tries to charge money to the wallet", () => {
            it("Should throw an error", async () => {
                await expect(chargeMoneyToWalletService.execute({ customer, amountToCharge: 100 })).rejects.toThrowError()
            })
        })
    })

    describe("Given a customer with a wallet", () => {
        const CUSTOMER_ID = new CustomerId()
        let customerPaymentMethod: PaymentMethod;
        let customer: Customer
        const GOOD_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }]

        beforeAll(async () => {
            customer = Customer.create(
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
                CUSTOMER_ID
            )

            customerPaymentMethod = new PaymentMethod("visa", "4242", 8, 2030, "420", false, "stripe_id")
            customer.addPaymentMethod(customerPaymentMethod)

            //@ts-ignore
            mockPaymentService.paymentIntent.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
                status: "succeeded",
                client_secret: "client_secret",
                id: "id",
            }))


            await mockCustomerRepository.save(customer)
            await createWallet.execute({ amountToCharge: 10, customerId: CUSTOMER_ID.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, paymentMethodForChargingId: customerPaymentMethod.id.toString() })
        })

        describe("When it tries to charge money to the wallet with a negative amount", () => {
            it("Should throw an error", async () => {
                await expect(chargeMoneyToWalletService.execute({ customer, amountToCharge: -1 })).rejects.toThrowError()
            })
        })

        describe("When it tries to charge money to the wallet with an amount less than 0.5", () => {
            it("Should throw an error", async () => {
                await expect(chargeMoneyToWalletService.execute({ customer, amountToCharge: 0.4 })).rejects.toThrowError()
            })
        })

        describe("When it tries to charge money to the wallet with a valid amount of money", () => {
            it("Should charge the money to the wallet", async () => {
                customer.wallet!.balance = 5.99
                await chargeMoneyToWalletService.execute({ customer, amountToCharge: 6.99 })
                await chargeMoneyToWalletService.execute({ customer, amountToCharge: 19.99 })

                const updatedCustomer: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(updatedCustomer.wallet?.balance).toEqual(32.97)
            })
        })
    })
})