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
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders";
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";
import { gourmetPlan, planVegetariano, planVegetarianoVariant2Persons2Recipes } from "../../mocks/plan";
import { arepasDeCrhistian, bowlDeQuinoa, burgerHallouli, rissotoDeBoniato } from "../../mocks/recipe";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates";
import { TUESDAY } from "../../mocks/days";
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { IMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/IMailingListService";
import { MockMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/mockMailingListService";


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

mockPlanRepository.bulkSave([gourmetPlan, planVegetariano])
mockRecipeRepository.save(burgerHallouli)
mockRecipeRepository.save(arepasDeCrhistian)
mockRecipeRepository.save(rissotoDeBoniato)
mockRecipeRepository.save(bowlDeQuinoa)

const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockMailingListService: IMailingListService = new MockMailingListService()


const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const chooseRecipesForOrderUseCase = new ChooseRecipesForOrder(mockOrderRepository, mockRecipeRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository)
const cancelASubscriptionUseCase = new CancelASubscription(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockNotificationService, mockMailingListService, mockLogRepository, mockRecipeRatingRepository)

const valenciaPolygon = [
    [39.75, -0.78],  // Noroeste
    [39.75, -0.22],  // Noreste
    [38.98, -0.22],  // Sureste
    [38.98, -0.78]   // Suroeste
];
const customerShippingZoneRadio = new ShippingZoneRadio(valenciaPolygon.map((coordinates) => new Coordinates(coordinates[0], coordinates[1])))
const MOCK_SHIPPING_COST = 10
const customerShippingZone = ShippingZone.create("Valencia", "valencia", MOCK_SHIPPING_COST, "active", customerShippingZoneRadio, TUESDAY)
mockShippingZoneRepository.save(customerShippingZone)



describe('Cancel subscriptiont tests', () => {
    describe("Given a user with an active subscription and recipes chosen", () => {
        const CUSTOMER_ID = new CustomerId()
        let customer: Customer
        let subscriptionResult: any
        const PURCHASE_DATE: Date = new Date(2023, 7, 3, 17)
        var subscription: Subscription

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

            const createSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                planFrequency: "weekly",
                restrictionComment: "string",
                stripePaymentMethodId: "",
                couponId: undefined,
                paymentMethodId: "string",
                addressName: CUSTOMER_ADDRESS_NAME,
                addressDetails: CUSTOMER_ADDRESS_DETAILS,
                latitude: CUSTOMER_LATITUDE,
                longitude: CUSTOMER_LONGITUDE,
                customerFirstName: CUSTOMER_FIRST_NAME,
                customerLastName: CUSTOMER_LAST_NAME,
                phone1: CUSTOMER_PHONE,
                locale: Locale.es,
                shippingCity: "Alboraya",
                shippingProvince: "Valencia",
                shippingPostalCode: "46120",
                shippingCountry: "España",
                purchaseDate: PURCHASE_DATE
            }
            subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            subscription = subscriptionResult.subscription

            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
            rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, subscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute({
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }, { quantity: 1, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
                choosingDate: PURCHASE_DATE
            })
        })

        describe("When the user cancels the subscription", () => {
            beforeAll(async () => {
                await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: subscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "alejoscotti@gmail.com", queryDate: new Date(2023, 7, 4, 17) })
            })

            it("It should leave the subscription in SUBSCRIPTION_CANCELLED state", () => {
                expect(subscription.state.isCancelled()).toBeTruthy()
            })

            it("Should remove the shipping dates from the recipe ratings", async () => {
                const customerRatings = await mockRecipeRatingRepository.findAllByCustomer(CUSTOMER_ID, Locale.es)

                expect(customerRatings[0].shippingDates.length).toBe(0)
                expect(customerRatings[1].shippingDates.length).toBe(0)
            })
        })
    })
})