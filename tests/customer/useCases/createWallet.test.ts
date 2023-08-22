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
const mockRecipeRepository = new MockRecipeRepository([])

const createWalletUseCase = new CreateWallet(mockCustomerRepository)

describe("Create wallet Use Case", () => {
    describe("Given a customer", () => {
        const CUSTOMER_ID = new CustomerId()
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
                    paymentMethodForChargingId: "wrongId",
                    datesOfCharge: GOOD_DATES_OF_CHARGE
                })).rejects.toThrow("El método de pago ingresado para cargar la billetera no existe")
            })

        })

        describe("When the customer wants to create a wallet with a correct payment method", () => {
            let customerPaymentMethod: PaymentMethod;

            beforeAll(async () => {
                customerPaymentMethod = new PaymentMethod("visa", "4242", 8, 2030, "420", false, "stripe_id")
                customer.addPaymentMethod(customerPaymentMethod)
                const createWallet = new CreateWallet(mockCustomerRepository)

                await createWallet.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 0,
                    paymentMethodForChargingId: customerPaymentMethod.id.toString(),
                    datesOfCharge: GOOD_DATES_OF_CHARGE
                })
            })

            it("Should create the wallet", async () => {
                const customerWithWallet: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)

                expect(customerWithWallet.wallet).toBeDefined()
                expect(customerWithWallet.wallet?.balance).toBe(0)
                expect(customerWithWallet.wallet?.amountToCharge).toBe(0)
                expect(customerWithWallet.wallet?.paymentMethodForCharging).toBe(customerPaymentMethod.id.toString())
            })
        })
        describe("When the customer wants to create a wallet with a duplicated day of charge", () => {
            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 0,
                    paymentMethodForChargingId: "wrongId",
                    datesOfCharge: DUPLICATED_DATES_OF_CHARGE
                })).rejects.toThrow()
            })
        })

        describe("When the customer wants to create a wallet with more than 7 days of charge", () => {
            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 0,
                    paymentMethodForChargingId: "wrongId",
                    datesOfCharge: [{ dayNumber: 3, hour: "17", minute: "30" }, { dayNumber: 5, hour: "17", minute: "30" }, { dayNumber: 6, hour: "17", minute: "30" }, { dayNumber: 0, hour: "17", minute: "30" }, { dayNumber: 4, hour: "17", minute: "30" }, { dayNumber: 2, hour: "17", minute: "30" }, { dayNumber: 1, hour: "17", minute: "30" }, { dayNumber: 3, hour: "17", minute: "30" }]
                })).rejects.toThrow()
            })
        })

        describe("When te customer wants to create a wallet without specifyng the date of charge", () => {
            it("Should throw an error", async () => {
                await expect(createWalletUseCase.execute({
                    customerId: CUSTOMER_ID.toString(),
                    amountToCharge: 0,
                    paymentMethodForChargingId: "wrongId",
                    datesOfCharge: []
                })).rejects.toThrow()
            })
        })
    })
});