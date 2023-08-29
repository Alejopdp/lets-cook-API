import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet";
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum";
import { CUSTOMER_EMAIL, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";

const mockCustomerRepository = new InMemoryCustomerRepository([])

const createWalletUseCase = new CreateWallet(mockCustomerRepository)

describe("Create wallet Use Case", () => {
    describe("Given a customer", () => {
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

        describe("When the customer wants to create a wallet with a wrong payment method", () => {

            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 0,
                    paymentMethodForCharging: "wrongId",
                    datesOfCharge: GOOD_DATES_OF_CHARGE
                })).rejects.toThrow("El método de pago ingresado para cargar la billetera no existe")
            })

        })

        describe("When the customer wants to create a wallet with a correct payment method", () => {

            beforeAll(async () => {
                customerPaymentMethod = new PaymentMethod("visa", "4242", 8, 2030, "420", false, "stripe_id")
                customer.addPaymentMethod(customerPaymentMethod)
                const createWallet = new CreateWallet(mockCustomerRepository)

                await createWallet.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 0.5,
                    paymentMethodForCharging: customerPaymentMethod.id.toString(),
                    datesOfCharge: GOOD_DATES_OF_CHARGE
                })
            })

            it("Should create the wallet", async () => {
                const customerWithWallet: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(customerWithWallet.wallet).toBeDefined()
                expect(customerWithWallet.wallet?.balance).toBe(0)
                expect(customerWithWallet.wallet?.amountToCharge).toBe(0.5)
                expect(customerWithWallet.wallet?.paymentMethodForCharging).toBe(customerPaymentMethod.id.toString())
            })

            it("Should create the wallet as a payment method", async () => {
                const customerWithWallet: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(customerWithWallet.paymentMethods.find(paymentMethod => paymentMethod.id.toString() === "wallet")).toBeTruthy()
            })

            it("Should not set the wallet as default", async () => {
                const customerWithWallet: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(customerWithWallet.getDefaultPaymentMethod()?.id.toString()).not.toBe("wallet")
            })

            it("Should add a log to the wallet", async () => {
                const customerWithWallet: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(customerWithWallet.wallet?.walletMovements.length).toBe(1)
                expect(customerWithWallet.wallet?.walletMovements[0].type).toBe(WalletMovementLogType.CREATE_WALLET)
            })
        })

        describe("When the customer wanst to creat a wallet with less than 0.5", () => {
            const CUSTOMER_ID = new CustomerId()
            let customerPaymentMethod: PaymentMethod;
            let customer: Customer

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
                await mockCustomerRepository.save(customer)
            })

            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 0.4,
                    paymentMethodForCharging: customerPaymentMethod.id.toString(),
                    datesOfCharge: GOOD_DATES_OF_CHARGE
                })).rejects.toThrow()
            })
        })

        describe("When the customer wants to create a wallet with a duplicated day of charge", () => {
            const CUSTOMER_ID = new CustomerId()
            let customerPaymentMethod: PaymentMethod;
            let customer: Customer

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
                await mockCustomerRepository.save(customer)
            })

            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 15,
                    paymentMethodForCharging: customerPaymentMethod.id.toString(),
                    datesOfCharge: DUPLICATED_DATES_OF_CHARGE
                })).rejects.toThrow()
            })
        })

        describe("When the customer wants to create a wallet with more than 7 days of charge", () => {
            const CUSTOMER_ID = new CustomerId()
            let customerPaymentMethod: PaymentMethod;
            let customer: Customer

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
                await mockCustomerRepository.save(customer)
            })

            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 20,
                    paymentMethodForCharging: customerPaymentMethod.id.toString(),
                    datesOfCharge: [{ dayNumber: 3, hour: "17", minute: "30" }, { dayNumber: 5, hour: "17", minute: "30" }, { dayNumber: 6, hour: "17", minute: "30" }, { dayNumber: 0, hour: "17", minute: "30" }, { dayNumber: 4, hour: "17", minute: "30" }, { dayNumber: 2, hour: "17", minute: "30" }, { dayNumber: 1, hour: "17", minute: "30" }, { dayNumber: 3, hour: "17", minute: "30" }]
                })).rejects.toThrow()
            })
        })

        describe("When te customer wants to create a wallet without specifyng the date of charge", () => {
            const CUSTOMER_ID = new CustomerId()
            let customerPaymentMethod: PaymentMethod;
            let customer: Customer

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
                await mockCustomerRepository.save(customer)
            })

            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 15,
                    paymentMethodForCharging: customerPaymentMethod.id.toString(),
                    datesOfCharge: []
                })).rejects.toThrow()
            })
        })

        describe("When the customer wants to create a wallet having a wallet already", () => {
            const CUSTOMER_ID = new CustomerId()
            let customerPaymentMethod: PaymentMethod;
            let customer: Customer

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
                await mockCustomerRepository.save(customer)
                await createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 10,
                    paymentMethodForCharging: customerPaymentMethod.id.toString(),
                    datesOfCharge: GOOD_DATES_OF_CHARGE
                })
            })
            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 10,
                    paymentMethodForCharging: customerPaymentMethod.id.toString(),
                    datesOfCharge: GOOD_DATES_OF_CHARGE
                })).rejects.toThrow()
            })
        })
    })
});