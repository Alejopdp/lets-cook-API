import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { InMemoryLogRepository } from "../../../src/bounded_contexts/operations/infra/repositories/log/mockLogRepository";
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet";
import { UpdatePaymentMethod } from "../../../src/bounded_contexts/operations/useCases/updatePaymentMethod/updatePaymentMethod";
import { CUSTOMER_EMAIL, CUSTOMER_PASSWORD } from "../../mocks/customer"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { MockStorageService } from "../../../src/bounded_contexts/operations/application/storageService/mockStorageService";
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockLogRepository = new InMemoryLogRepository([])
const mockStorageService = new MockStorageService()

const createWalletUseCase = new CreateWallet(mockCustomerRepository)
const updatePaymentMethodUseCase = new UpdatePaymentMethod(mockCustomerRepository, mockStorageService, mockLogRepository)

describe("Update payment method use case", () => {
    describe("Given a customer with many payment methods", () => {
        const CUSTOMER_ID = new CustomerId()
        const PAYMENT_METHOD_1 = new PaymentMethod("visa", "4242", 12, 2030, "123", true, "stripe_1")
        const PAYMENT_METHOD_2 = new PaymentMethod("visa", "4242", 12, 2030, "123", false, "stripe_2")
        const PAYMENT_METHOD_3 = new PaymentMethod("visa", "4242", 12, 2030, "123", false, "stripe_3")
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

            customer.addPaymentMethod(PAYMENT_METHOD_1)
            customer.addPaymentMethod(PAYMENT_METHOD_2)
            customer.addPaymentMethod(PAYMENT_METHOD_3)

            await mockCustomerRepository.save(customer)

        })

        describe("When the customer updates the payment method", () => {
            beforeAll(async () => {
                await updatePaymentMethodUseCase.execute({
                    customerId: customer.id.toString(),
                    paymentId: PAYMENT_METHOD_2.id.toString(),
                    brand: "mastercard",
                    last4Numbers: "1234",
                    exp_month: 12,
                    exp_year: 2030,
                    cvc: "123",
                    stripeId: "stripe_2",
                    isDefault: true,
                    nameOrEmailOfAdminExecutingRequest: undefined
                })
            })

            it("Should set the new payment method as default", async () => {
                expect(customer.getDefaultPaymentMethod()?.id.toString()).toBe(PAYMENT_METHOD_2.id.toString())
            })

            it("Should not change any payment method property", async () => {
                expect(PAYMENT_METHOD_2.brand).toBe("visa")
            })
        })



        describe("When the customer change the default payment method to one that doesn't exist", () => {

            it("Should throw an error", async () => {
                await expect(updatePaymentMethodUseCase.execute({
                    customerId: customer.id.toString(),
                    paymentId: "wrong_id",
                    brand: "mastercard",
                    last4Numbers: "1234",
                    exp_month: 12,
                    exp_year: 2030,
                    cvc: "123",
                    stripeId: "stripe_2",
                    isDefault: true,
                    nameOrEmailOfAdminExecutingRequest: undefined
                })).rejects.toThrow()
            })
        })

        describe("When the customer wants to set his wallet as default payment method and the wallet doesn't exist", () => {
            it("Should throw an error", async () => {
                await expect(updatePaymentMethodUseCase.execute({
                    customerId: customer.id.toString(),
                    paymentId: "wallet",
                    brand: "",
                    last4Numbers: "",
                    exp_month: 12,
                    exp_year: 2030,
                    cvc: "",
                    stripeId: "",
                    isDefault: true,
                    nameOrEmailOfAdminExecutingRequest: undefined
                })).rejects.toThrow()
            })
        })

        describe("When the customer wants to set his wallet as default payment method and the wallet exists", () => {
            const GOOD_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }]

            beforeAll(async () => {
                await createWalletUseCase.execute({
                    customerId: customer.id.toString(),
                    amountToCharge: 100,
                    datesOfCharge: GOOD_DATES_OF_CHARGE,
                    paymentMethodForCharging: PAYMENT_METHOD_1.id.toString(),
                    locale: Locale.es
                })
            })

            it("Should set the wallet as default payment method", async () => {
                await updatePaymentMethodUseCase.execute({
                    customerId: customer.id.toString(),
                    paymentId: "wallet",
                    brand: "",
                    last4Numbers: "",
                    exp_month: 12,
                    exp_year: 2030,
                    cvc: "",
                    stripeId: "",
                    isDefault: true,
                    nameOrEmailOfAdminExecutingRequest: undefined
                })

                expect(customer.getDefaultPaymentMethod()?.id.toString()).toBe("wallet")
            })

            it("Should create a wallet movement log", async () => {
                expect(customer.wallet?.walletMovements.filter(log => log.type === WalletMovementLogType.SELECT_WALLET_AS_DEFAULT).length).toBe(1)
            })

            afterAll(async () => {
                customer.wallet = undefined
            })
        })

        describe("When the customer wants to set his wallet as default payment method but the wallet doesn't exist", () => {
            it("Should throw an error", async () => {
                await expect(updatePaymentMethodUseCase.execute({
                    customerId: customer.id.toString(),
                    paymentId: "wallet",
                    brand: "",
                    last4Numbers: "",
                    exp_month: 12,
                    exp_year: 2030,
                    cvc: "",
                    stripeId: "",
                    isDefault: true,
                    nameOrEmailOfAdminExecutingRequest: undefined
                })).rejects.toThrow()
            })
        })
    })
})