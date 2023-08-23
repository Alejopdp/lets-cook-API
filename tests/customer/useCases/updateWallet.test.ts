import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet";
import { UpateWallet } from "../../../src/bounded_contexts/operations/useCases/updateWallet/updateWallet";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";

const mockCustomerRepository = new InMemoryCustomerRepository([])
const createWalletUseCase = new CreateWallet(mockCustomerRepository)
const updateWalletUseCase = new UpateWallet(mockCustomerRepository)

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
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 27.99, paymentMethodForChargingId: "payment_method_id", datesOfCharge: [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }], isEnabled: true })).rejects.toThrowError()
            })
        })
    })
    describe("Given a valid wallet", () => {

        const GOOD_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }]


        beforeAll(async () => {
            await createWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 27.99, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE })
        })

        describe("When the user updates the amount to charge to an amount less than 0.5", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.4, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true })).rejects.toThrow()
            })
        })

        describe("When the user updates the amount to charge to an amount greater than 0.5", () => {
            it("Should update the amount correctly", () => {

                expect(customer.wallet?.amountToCharge).toBe(27.99)
            })
        })

        describe("When the user updates the payment method for charging to a valid payment method", () => {
            let newCustomerPaymentMethod: PaymentMethod;

            beforeAll(async () => {
                newCustomerPaymentMethod = new PaymentMethod("visa", "4242", 8, 2030, "420", false, "stripe_id_2")
                customer.addPaymentMethod(newCustomerPaymentMethod)
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: newCustomerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true })
            })

            it("Should update the payment method correctly", () => {
                expect(customer.wallet?.paymentMethodForCharging).toBe(newCustomerPaymentMethod.id.toString())
            })
        })

        describe("When the user updates the payment method for charging to an invalid payment method", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: "invalid_payment_method_id", datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true })).rejects.toThrowError()
            })
        })

        describe("When the user updates the wallet without a payment method for charging", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: "", datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true })).rejects.toThrow()
            })
        })

        describe("When the user updates the dates of charge to a valid dates of charge", () => {
            const NEW_DATES_OF_CHARGE = [{ dayNumber: 2, hour: "13", minute: "45" }, { dayNumber: 4, hour: "17", minute: "30" }]

            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: NEW_DATES_OF_CHARGE, isEnabled: true })
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
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: NEW_DATES_OF_CHARGE, isEnabled: true })).rejects.toThrowError()
            })
        })

        describe("When the user updates the dates of charge to an empty array", () => {
            it("Should throw an error", async () => {
                await expect(() => updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: [], isEnabled: true })).rejects.toThrowError()
            })
        })

        describe("When the user disables the charging", () => {
            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: false })
            })

            it("Should disable the charging", () => {
                expect(customer.wallet?.isEnabled).toBe(false)
            })
        })

        describe("When the user tries to update the wallet when it is disabled", () => {
            beforeAll(async () => {
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true })
                await updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: false })
            })
            it("Should throw an error if it is not enabling it", async () => {
                await expect(updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.6, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: false })).rejects.toThrowError()
            })

            it("Should not throw an error if it is enabling it", async () => {
                await expect(updateWalletUseCase.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 0.8, paymentMethodForChargingId: customerPaymentMethod.id.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, isEnabled: true })).resolves.not.toThrow()
            })
        })
    })
});