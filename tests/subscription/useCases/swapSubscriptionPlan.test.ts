jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import moment from "moment"
import { CreateSubscription, CreateSubscriptionResponse } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { SkipOrders } from "../../../src/bounded_contexts/operations/useCases/skipOrders/skipOrders"
import { SwapSubscriptionPlan } from "../../../src/bounded_contexts/operations/useCases/swapSubscriptionPlan/swapSubscriptionPlan"
import { CreateWallet } from "../../../src/bounded_contexts/operations/useCases/createWallet/createWallet"
import { ChargeMoneyToWalletUseCase } from "../../../src/bounded_contexts/operations/useCases/chargeMoneyToWallet/chargeMoneyToWallet"
import { ChargeMoneyToWallet } from "../../../src/bounded_contexts/operations/services/chargeMoneyToWallet/chargeMoneyToWallet"
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository"
import { InMemorySusbcriptionRepository } from "../../../src/bounded_contexts/operations/infra/repositories/subscription/inMemorySubscriptionRepository"
import { InMemoryShippingZoneRepository } from "../../../src/bounded_contexts/operations/infra/repositories/shipping/inMemoryShippingZoneRepository"
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository"
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository"
import { InMemoryOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/order/mockOrderRepository"
import { InMemoryCouponRepository } from "../../../src/bounded_contexts/operations/infra/repositories/coupon/mockCouponRepository"
import { InMemoryPaymentOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/paymentOrder/mockPaymentOrderRepository"
import { InMemoryLogRepository } from "../../../src/bounded_contexts/operations/infra/repositories/log/mockLogRepository"
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService"
import { MockNotificationService } from "../../../src/shared/notificationService/mockNotificationService"
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders"
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders"
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer"
import { UserPassword } from "../../../src/bounded_contexts/IAM/domain/user/UserPassword"
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale"
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId"
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio"
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates"
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode"
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order"
import { PaymentOrder } from "../../../src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder"
import { CreateSubscriptionDto } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscriptionDto"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { gourmetPlan, gourmetPlanSku, planGourmetVariant2Persons2Recipes, planGourmetVariant2Persons3Recipes, planVegetariano, planVegetarianoVariant2Persons3Recipes, planVegetarianoVariant2Persons5Recipes } from "../../mocks/plan"
import { TUESDAY, WEDNESDAY } from "../../mocks/days"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod"
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum"
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository"
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { PayAllSubscriptions } from "../../../src/bounded_contexts/operations/services/payAllSubscriptions/payAllSubscriptions"
import { ChooseRecipesForOrder } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrder"
import { MockRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/mockRecipeRepository"
import { bowlDeQuinoa, burgerHallouli, rissotoDeBoniato } from "../../mocks/recipe"
import { UpdateDiscountAfterSkippingOrders } from "../../../src/bounded_contexts/operations/services/updateDiscountsAfterSkippingOrders/updateDiscountsAfterSkippingOrders"

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository()
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService() as jest.Mocked<MockPaymentService>
const mockNotificationService = new MockNotificationService()
const mockRecipeRepository = new MockRecipeRepository([])
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockLogRepository = new InMemoryLogRepository([])
const mockRecipeRatingRepository = new InMemoryRateRepository([])
const updateDiscountsAfterSKippingOrdersService = new UpdateDiscountAfterSkippingOrders(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockShippingZoneRepository)
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const swapSubscriptionPlanUseCase = new SwapSubscriptionPlan(mockSubscriptionRepository, mockOrderRepository, mockPlanRepository, mockPaymentOrderRepository, mockCouponRepository, mockShippingZoneRepository, mockLogRepository, mockRecipeRatingRepository)
const skipOrderUseCase = new SkipOrders(mockOrderRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository, mockSubscriptionRepository, updateDiscountsAfterSKippingOrdersService)

mockPlanRepository.save(gourmetPlan)
mockPlanRepository.save(planVegetariano)

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
const payAllSubscriptions = new PayAllSubscriptions(mockCustomerRepository, mockOrderRepository, mockPaymentOrderRepository, mockPaymentService, mockSubscriptionRepository, mockWeekRepository, mockShippingZoneRepository, mockNotificationService)

mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => {
    return {
        client_secret: "client_secret",
        id: "id",
        status: "succeeded",
        amount: 0
    }
}
)
//@ts-ignore
mockPaymentService.paymentIntent.mockImplementation(async (): Promise<PaymentIntent> => ({
    status: "succeeded",
    client_secret: "client_secret",
    id: "payment_intent_id",
    amount: 0,

}))


describe("Swap plan use case", () => {
    describe("Given a customer with a subscription", () => {
        const FIRST_PLAN_PRICE = planGourmetVariant2Persons2Recipes.getPaymentPrice()
        const SECOND_PLAN_PRICE = planGourmetVariant2Persons3Recipes.getPaymentPrice()
        const PURCHASE_DATE = new Date(2023, 5, 12, 15)
        const CUSTOMER_ID = new CustomerId()
        let customer: Customer
        let subscriptionResult: CreateSubscriptionResponse

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

            const createSubscriptionDto: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
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


            await payAllSubscriptions.execute({ executionDate: new Date(2023, 5, 17, 4) })
            await payAllSubscriptions.execute({ executionDate: new Date(2023, 5, 24, 4) })

        })

        describe("When the customer swaps the plan variant of the same plan", () => {
            beforeAll(async () => {
                await swapSubscriptionPlanUseCase.execute({
                    nameOrEmailOfAdminExecutingRequest: "",
                    newPlanId: gourmetPlan.id.toString(),
                    newPlanVariantId: planGourmetVariant2Persons3Recipes.id.toString(),
                    queryDate: new Date(2023, 5, 25, 4),
                    subscriptionId: subscriptionResult.subscription.id.toString(),
                })
            })

            it("Should update the subscription plan", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(subscriptionResult.subscription.id, Locale.es)
                expect(subscription.plan.id.toString()).toBe(gourmetPlan.id.toString())
                expect(subscription.planVariantId.toString()).toBe(planGourmetVariant2Persons3Recipes.id.toString())
            })

            it("Should leave the billed orders with the old plan data", async () => {
                const subscriptionOrders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const lastBilledOrders: Order[] = subscriptionOrders.filter((order) => order.isBilled())

                for (const order of lastBilledOrders) {
                    expect(order.plan.id.toString()).toBe(gourmetPlan.id.toString())
                    expect(order.planVariantId.toString()).toBe(planGourmetVariant2Persons2Recipes.id.toString())
                    expect(order.price).toBe(FIRST_PLAN_PRICE)
                }
            })

            it("Should leave the billed payment orders with the old amount", async () => {
                const subscriptionPaymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const lastBilledPaymentOrders: PaymentOrder[] = subscriptionPaymentOrders.filter((paymentOrder) => paymentOrder.isBilled())

                for (const paymentOrder of lastBilledPaymentOrders) {
                    expect(paymentOrder.amount).toBe(FIRST_PLAN_PRICE)
                }
            })

            it("Should set the new amount to the active orders", async () => {
                const subscriptionOrders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const activeOrders: Order[] = subscriptionOrders.filter((order) => order.isActive())

                for (const order of activeOrders) {
                    expect(order.plan.id.toString()).toBe(gourmetPlan.id.toString())
                    expect(order.planVariantId.toString()).toBe(planGourmetVariant2Persons3Recipes.id.toString())
                    expect(order.price).toBe(SECOND_PLAN_PRICE)
                }
            })

            it("Should set the new amount to the active payment orders", async () => {
                const subscriptionPaymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const activePaymentOrders: PaymentOrder[] = subscriptionPaymentOrders.filter((paymentOrder) => paymentOrder.isActive())

                for (const paymentOrder of activePaymentOrders) {
                    expect(paymentOrder.amount).toBe(SECOND_PLAN_PRICE)
                }
            })
        })

        describe("When the customer swaps to a new plan", () => {
            const SECOND_PLAN_PRICE = planVegetarianoVariant2Persons5Recipes.getPaymentPrice()

            beforeAll(async () => {
                await swapSubscriptionPlanUseCase.execute({
                    nameOrEmailOfAdminExecutingRequest: "",
                    newPlanId: planVegetariano.id.toString(),
                    newPlanVariantId: planVegetarianoVariant2Persons5Recipes.id.toString(),
                    queryDate: new Date(2023, 5, 25, 4),
                    subscriptionId: subscriptionResult.subscription.id.toString(),
                })
            })

            it("Should update the subscription plan", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(subscriptionResult.subscription.id, Locale.es)
                expect(subscription.plan.id.toString()).toBe(planVegetariano.id.toString())
                expect(subscription.planVariantId.toString()).toBe(planVegetarianoVariant2Persons5Recipes.id.toString())
            })

            it("Should update the subscription price to the plan payment price", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(subscriptionResult.subscription.id, Locale.es)
                expect(subscription.price).toBe(SECOND_PLAN_PRICE)
            })

            it("Should leave the billed orders with the old plan data", async () => {
                const subscriptionOrders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const lastBilledOrders: Order[] = subscriptionOrders.filter((order) => order.isBilled())

                for (const order of lastBilledOrders) {
                    expect(order.plan.id.toString()).toBe(gourmetPlan.id.toString())
                    expect(order.planVariantId.toString()).toBe(planGourmetVariant2Persons2Recipes.id.toString())
                    expect(order.price).toBe(FIRST_PLAN_PRICE)
                }
            })

            it("Should leave the billed payment orders with the old amount", async () => {
                const subscriptionPaymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const lastBilledPaymentOrders: PaymentOrder[] = subscriptionPaymentOrders.filter((paymentOrder) => paymentOrder.isBilled())

                for (const paymentOrder of lastBilledPaymentOrders) {
                    expect(paymentOrder.amount).toBe(FIRST_PLAN_PRICE)
                }
            })

            it("Should set the new amount to the active orders", async () => {
                const subscriptionOrders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const activeOrders: Order[] = subscriptionOrders.filter((order) => order.isActive())

                for (const order of activeOrders) {
                    expect(order.plan.id.toString()).toBe(planVegetariano.id.toString())
                    expect(order.planVariantId.toString()).toBe(planVegetarianoVariant2Persons5Recipes.id.toString())
                    expect(order.price).toBe(SECOND_PLAN_PRICE)
                }
            })

            it("Should set the new amount to the active payment orders", async () => {
                const subscriptionPaymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const activePaymentOrders: PaymentOrder[] = subscriptionPaymentOrders.filter((paymentOrder) => paymentOrder.isActive())

                for (const paymentOrder of activePaymentOrders) {
                    expect(paymentOrder.amount).toBe(SECOND_PLAN_PRICE)
                }
            })

        })
    })

    describe("Given a customer with a subscription and selected recipes for an order", () => {
        const FIRST_PLAN_PRICE = planGourmetVariant2Persons2Recipes.getPaymentPrice()
        const SECOND_PLAN_PRICE = planGourmetVariant2Persons3Recipes.getPaymentPrice()
        const PURCHASE_DATE = new Date(2023, 5, 12, 15)
        const CUSTOMER_ID = new CustomerId()
        let customer: Customer
        let subscriptionResult: CreateSubscriptionResponse

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

            const createSubscriptionDto: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
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

            const weeks = await mockWeekRepository.findAll()
            const originalWeeks = [...burgerHallouli.availableWeeks]
            burgerHallouli.availableWeeks = [...burgerHallouli.availableWeeks, ...weeks]
            mockRecipeRepository.save(burgerHallouli)
            mockRecipeRepository.save(bowlDeQuinoa)

            const chooseRecipesForOrderUseCase = new ChooseRecipesForOrder(mockOrderRepository, mockRecipeRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository)

            await chooseRecipesForOrderUseCase.execute({
                choosingDate: new Date(2023, 5, 14, 4),
                isAdminChoosing: false,
                isInCheckout: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: burgerHallouli.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
            })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 5, 17, 4) })

            const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
            orders.sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())

            await chooseRecipesForOrderUseCase.execute({
                choosingDate: new Date(2023, 5, 21, 4),
                isAdminChoosing: false,
                isInCheckout: false,
                orderId: orders.filter(order => order.isActive())[0].id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: burgerHallouli.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
            })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 5, 24, 4) })

            await chooseRecipesForOrderUseCase.execute({
                choosingDate: new Date(2023, 5, 28, 4),
                isAdminChoosing: false,
                isInCheckout: false,
                orderId: orders.filter(order => order.isActive())[0].id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: burgerHallouli.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
            })

            burgerHallouli.availableWeeks = [...originalWeeks]

        })

        describe("When the customer swaps the plan variant of the same plan", () => {
            beforeAll(async () => {
                await swapSubscriptionPlanUseCase.execute({
                    nameOrEmailOfAdminExecutingRequest: "",
                    newPlanId: gourmetPlan.id.toString(),
                    newPlanVariantId: planGourmetVariant2Persons3Recipes.id.toString(),
                    queryDate: new Date(2023, 5, 25, 4),
                    subscriptionId: subscriptionResult.subscription.id.toString(),
                })
            })

            it("Should leave the recipe selection of the billed orders as it was", async () => {
                const subscriptionOrders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                const billedOrders = subscriptionOrders.filter((order) => order.isBilled())

                for (const order of billedOrders) {
                    expect(order.recipeSelection.length).toBe(1)
                    expect(order.recipeSelection[0].quantity).toBe(2)
                    expect(order.recipeSelection[0].recipe.id.toString()).toBe(burgerHallouli.id.toString())
                }
            })

            it("Should delete the recipe selection of the active orders", async () => {
                const subscriptionOrders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                const activeOrders = subscriptionOrders.filter((order) => order.isActive())

                for (const order of activeOrders) {
                    expect(order.recipeSelection.length).toBe(0)
                }
            })

        })
    })

    describe("Given a customer with a subscription and skipped orders", () => {
        const FIRST_PLAN_PRICE = planGourmetVariant2Persons2Recipes.getPaymentPrice()
        const SECOND_PLAN_PRICE = planGourmetVariant2Persons3Recipes.getPaymentPrice()
        const PURCHASE_DATE = new Date(2023, 5, 12, 15)
        const CUSTOMER_ID = new CustomerId()
        let customer: Customer
        let subscriptionResult: CreateSubscriptionResponse

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

            const createSubscriptionDto: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
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

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 5, 17, 4) })
            await payAllSubscriptions.execute({ executionDate: new Date(2023, 5, 24, 4) })

            const orders = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
            const lastTwoOrders = orders.slice(orders.length - 3, orders.length - 1)

            skipOrderUseCase.execute({
                locale: Locale.es,
                nameOrEmailOfAdminExecutingRequest: "",
                ordersToReactivate: [],
                ordersToSkip: lastTwoOrders.map((order) => order.id.toString()),
                queryDate: new Date(2023, 5, 25, 4),
            })

        })

        describe("When the customer swaps the plan variant of the same plan", () => {
            beforeAll(async () => {
                await swapSubscriptionPlanUseCase.execute({
                    nameOrEmailOfAdminExecutingRequest: "",
                    newPlanId: gourmetPlan.id.toString(),
                    newPlanVariantId: planGourmetVariant2Persons3Recipes.id.toString(),
                    queryDate: new Date(2023, 5, 25, 4),
                    subscriptionId: subscriptionResult.subscription.id.toString(),
                })
            })


            it("Should also change the skipped orders data", async () => {
                const subscriptionOrders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                const lastTwoOrders = subscriptionOrders.slice(subscriptionOrders.length - 3, subscriptionOrders.length - 1)

                for (const order of lastTwoOrders) {
                    expect(order.plan.id.toString()).toBe(gourmetPlan.id.toString())
                    expect(order.planVariantId.toString()).toBe(planGourmetVariant2Persons3Recipes.id.toString())
                    expect(order.price).toBe(SECOND_PLAN_PRICE)
                }
            })

            it("Should also change the skipped payment orders data", async () => {
                const subscriptionOrders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                const lastTwoOrders = subscriptionOrders.slice(subscriptionOrders.length - 3, subscriptionOrders.length - 1)
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByIdList(lastTwoOrders.map((order) => order.paymentOrderId!))

                for (const paymentOrder of paymentOrders) {
                    expect(paymentOrder.amount).toBe(0)
                }
            })

            it("Should leave the new plan data if the skipped orders are reactivated", async () => {
                const subscriptionOrders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                const lastTwoOrders = subscriptionOrders.slice(subscriptionOrders.length - 3, subscriptionOrders.length - 1)

                skipOrderUseCase.execute({
                    locale: Locale.es,
                    nameOrEmailOfAdminExecutingRequest: "",
                    ordersToReactivate: lastTwoOrders.map((order) => order.id.toString()),
                    ordersToSkip: [],
                    queryDate: new Date(2023, 5, 25, 9),
                })

                for (const order of lastTwoOrders) {
                    expect(order.plan.id.toString()).toBe(gourmetPlan.id.toString())
                    expect(order.planVariantId.toString()).toBe(planGourmetVariant2Persons3Recipes.id.toString())
                    expect(order.price).toBe(SECOND_PLAN_PRICE)
                }
            })

        })
    })
})