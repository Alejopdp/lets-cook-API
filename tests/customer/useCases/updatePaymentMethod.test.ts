import { ChooseRecipesForOrder } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrder"
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { CancelASubscription } from "../../../src/bounded_contexts/operations/useCases/cancelASubscription/cancelASubscription"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { InMemorySusbcriptionRepository } from "../../../src/bounded_contexts/operations/infra/repositories/subscription/inMemorySubscriptionRepository";
import { InMemoryShippingZoneRepository } from "../../../src/bounded_contexts/operations/infra/repositories/shipping/inMemoryShippingZoneRepository";
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository";
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository";
import { InMemoryOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/order/mockOrderRepository";
import { InMemoryCouponRepository } from "../../../src/bounded_contexts/operations/infra/repositories/coupon/mockCouponRepository";
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService";
import { MockNotificationService } from "../../../src/shared/notificationService/mockNotificationService";
import { InMemoryPaymentOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/paymentOrder/mockPaymentOrderRepository";
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository";
import { InMemoryLogRepository } from "../../../src/bounded_contexts/operations/infra/repositories/log/mockLogRepository";
import { MockRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/mockRecipeRepository";
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode";
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet";
import { UpdatePaymentMethod } from "../../../src/bounded_contexts/operations/useCases/updatePaymentMethod/updatePaymentMethod";
import { UpdateDiscountAfterSkippingOrders } from "../../../src/bounded_contexts/operations/services/updateDiscountsAfterSkippingOrders/updateDiscountsAfterSkippingOrders";
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders";
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";
import { ChooseRecipesForOrderDto } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrderDto";
import { gourmetPlan, planVegetariano, planVegetarianoVariant2Persons2Recipes } from "../../mocks/plan";
import { arepasDeCrhistian, bowlDeQuinoa, burgerHallouli, rissotoDeBoniato } from "../../mocks/recipe";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates";
import { TUESDAY } from "../../mocks/days";
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order";
import { RecipeRating } from "../../../src/bounded_contexts/operations/domain/recipeRating/RecipeRating";
import { IMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/IMailingListService";
import { MockMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/mockMailingListService";
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { DateOfCharge } from "../../../src/bounded_contexts/operations/domain/customer/wallet/DateOfCharge";
import { Day } from "../../../src/bounded_contexts/operations/domain/day/Day";
import { MockStorageService } from "../../../src/bounded_contexts/operations/application/storageService/mockStorageService";
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum";

const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository()
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService()
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const mockRecipeRatingRepository = new InMemoryRateRepository([])
const mockLogRepository = new InMemoryLogRepository([])
const mockStorageService = new MockStorageService()
const mockRecipeRepository = new MockRecipeRepository([])

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