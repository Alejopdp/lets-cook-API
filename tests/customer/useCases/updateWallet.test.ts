import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet";
import { UpdateWallet } from "../../../src/bounded_contexts/operations/useCases/updateWallet/updateWallet";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";

const mockCustomerRepository = new InMemoryCustomerRepository([])
const createWalletUseCase = new CreateWallet(mockCustomerRepository)
const updateWalletUseCase = new UpdateWallet(mockCustomerRepository)

describe("Update Wallet Use Case", () => {
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

    describe("Given a customer without a wallet", () => {
        describe("When the user tries to update the wallet", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 27.99, paymentMethodForCharging: "payment_method_id", datesOfCharge: [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }], isEnabled: true, locale: Locale.es })).rejects.toThrowError()
            })
        })
    })
    describe("Given a valid wallet", () => {

        const GOOD_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }]


        beforeAll(async () => {
            await createWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 27.99, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, locale: Locale.es })
        })

        describe("When the user updates the amount to charge to an amount less than 5", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.4, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })).rejects.toThrow()
            })
        })

        describe("When the user updates the amount to charge to an amount greater than 5", () => {
            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })
            })
            it("Should update the amount correctly", () => {

                expect(customer.wallet?.amountToCharge).toBe(6)
            })
        })

        describe("When the user updates the payment method for charging to a valid payment method", () => {
            let newCustomerPaymentMethod: PaymentMethod;

            beforeAll(async () => {
                newCustomerPaymentMethod = new PaymentMethod("visa", "4242", 8, 2030, "420", false, "stripe_id_2")
                customer.addPaymentMethod(newCustomerPaymentMethod)
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 66, paymentMethodForCharging: newCustomerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })
            })

            it("Should update the payment method correctly", () => {
                expect(customer.wallet?.paymentMethodForCharging).toBe(newCustomerPaymentMethod.id.toString())
            })
        })

        describe("When the user updates the payment method for charging to an invalid payment method", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: "invalid_payment_method_id", datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })).rejects.toThrowError()
            })
        })

        describe("When the user updates the wallet without a payment method for charging", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: "", datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })).rejects.toThrow()
            })
        })

        describe("When the user updates the dates of charge to a valid dates of charge", () => {
            const NEW_DATES_OF_CHARGE = [{ dayNumber: 2, hour: "13", minute: "45" }, { dayNumber: 4, hour: "17", minute: "30" }]

            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: NEW_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })
            })

            it("Should update the dates of charge correctly", () => {
                expect(customer.wallet?.datesOfCharge.length).toBe(2)
                expect(customer.wallet?.datesOfCharge[0].day.dayNumberOfWeek).toBe(2)
                expect(customer.wallet?.datesOfCharge[1].day.dayNumberOfWeek).toBe(4)
                expect(customer.wallet?.datesOfCharge[0].hour).toBe("13")
                expect(customer.wallet?.datesOfCharge[1].hour).toBe("17")
                expect(customer.wallet?.datesOfCharge[0].minute).toBe("45")
                expect(customer.wallet?.datesOfCharge[1].minute).toBe("30")
            })
        })

        describe("When the user updates the dates of charge duplicating one of them", () => {
            const NEW_DATES_OF_CHARGE = [{ dayNumber: 2, hour: "13", minute: "45" }, { dayNumber: 2, hour: "17", minute: "30" }]

            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: NEW_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })).rejects.toThrowError()
            })
        })

        describe("When the user updates the dates of charge to an empty array", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: [], isEnabled: true, locale: Locale.es })).rejects.toThrowError()
            })
        })

        describe("When the user disables the charging", () => {
            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: false, locale: Locale.es })
            })

            it("Should disable the charging", () => {
                expect(customer.wallet?.isEnabled).toBe(false)
            })

            it("Should create a wallet movement log", () => {
                expect(customer.wallet?.walletMovements.filter(log => log.type === WalletMovementLogType.DISABLE_WALLET).length === 1).toBe(true)
            })
        })

        describe("When the user tries to update the wallet when it is disabled", () => {
            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: false, locale: Locale.es })
            })
            it("Should throw an error if it is not enabling it", async () => {
                await expect(updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 6, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: false, locale: Locale.es })).rejects.toThrowError()
            })

            it("Should not throw an error if it is enabling it", async () => {
                await expect(updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 8, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })).resolves.not.toThrow()
            })
        })

        describe("When the user enables the charging", () => {

            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 8, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })
            })

            it("Should enable the charging", () => {
                expect(customer.wallet?.isEnabled).toBe(true)
            })

            it("Should create a wallet movement log", () => {
                expect(customer.wallet?.walletMovements.filter(log => log.type === WalletMovementLogType.ENABLE_WALLET).length).toBe(2)  // TODO: Remove dependency with previous case
            })
        })

        describe("When the user enables the charging", () => {

            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 8, paymentMethodForCharging: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true, locale: Locale.es })
            })

            it("Should enable the charging", () => {
                expect(customer.wallet?.isEnabled).toBe(true)
            })

            it("Should create a wallet movement log", () => {
                expect(customer.wallet?.walletMovements.filter(log => log.type === WalletMovementLogType.ENABLE_WALLET).length).toBe(2)  // TODO: Remove dependency with previous case
            })
        })
    })
});