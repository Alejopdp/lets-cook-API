jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import Big from "big.js"
import { SkipOrders } from "../../../src/bounded_contexts/operations/useCases/skipOrders/skipOrders"
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository"
import { InMemorySusbcriptionRepository } from "../../../src/bounded_contexts/operations/infra/repositories/subscription/inMemorySubscriptionRepository"
import { InMemoryShippingZoneRepository } from "../../../src/bounded_contexts/operations/infra/repositories/shipping/inMemoryShippingZoneRepository"
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository"
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository"
import { MockRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/mockRecipeRepository"
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
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService"
import { UpdateDiscountAfterSkippingOrders } from "../../../src/bounded_contexts/operations/services/updateDiscountsAfterSkippingOrders/updateDiscountsAfterSkippingOrders"
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { ChooseRecipesForOrder } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrder"
import { gourmetPlan, planAdicionalFrutas, planAdicionalFrutasVariante1, planGourmetVariant2Persons2Recipes } from "../../mocks/plan"
import { TUESDAY } from "../../mocks/days"
import { rissotoDeBoniato, arepasDeCrhistian, bowlDeQuinoa, burgerHallouli } from "../../mocks/recipe"
import { RecipeRating } from "../../../src/bounded_contexts/operations/domain/recipeRating/RecipeRating"
import { Day } from "../../../src/bounded_contexts/operations/domain/day/Day"
import { CreateSubscriptionDto } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscriptionDto"
import { PlanFrequency } from "../../../src/bounded_contexts/operations/domain/plan/PlanFrequency"

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository()
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService() as jest.Mocked<MockPaymentService>
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockRecipeRepository = new MockRecipeRepository([])

mockRecipeRepository.save(rissotoDeBoniato)
mockRecipeRepository.save(arepasDeCrhistian)
mockRecipeRepository.save(bowlDeQuinoa)
mockRecipeRepository.save(burgerHallouli)

const mockRecipeRatingRepository = new InMemoryRateRepository([])
const mockLogRepository = new InMemoryLogRepository([])
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const updateDiscountsAfterSKippingOrdersService = new UpdateDiscountAfterSkippingOrders(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockShippingZoneRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const skipOrderUseCase = new SkipOrders(mockOrderRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository, mockSubscriptionRepository, updateDiscountsAfterSKippingOrdersService)
const chooseRecipesForOrderUseCase = new ChooseRecipesForOrder(mockOrderRepository, mockRecipeRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository)

mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => ({
    client_secret: "client_secret",
    id: "id",
    status: "succeeded"
}))

const CUSTOMER_FIRST_NAME = "Alejo"
const CUSTOMER_LAST_NAME = "Scotti"
const CUSTOMER_PHONE = "634135817"
const CUSTOMER_ADDRESS_NAME = "Vicent Blasco Ibañez 5"
const CUSTOMER_ADDRESS_DETAILS = "Bloque 7, Escalera 2, Puerta 9"
const CUSTOMER_LATITUDE = 39.4869251
const CUSTOMER_LONGITUDE = -0.3298131
const CUSTOMER_ID = new CustomerId()
const CUSTOMER_PASSWORD = UserPassword.create("Pass1234", false)
const CUSTOMER_EMAIL = "alejoscotti@gmail.com"
const customer = Customer.create(
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
mockCustomerRepository.save(customer)
mockPlanRepository.save(gourmetPlan)
mockPlanRepository.save(planAdicionalFrutas)

const valenciaPolygon = [
    [39.75, -0.78],  // Noroeste
    [39.75, -0.22],  // Noreste
    [38.98, -0.22],  // Sureste
    [38.98, -0.78]   // Suroeste
];
const customerShippingZoneRadio = new ShippingZoneRadio(valenciaPolygon.map((coordinates) => new Coordinates(coordinates[0], coordinates[1])))
const MOCK_SHIPPING_COST = 10
const DAY = new Day(2)
const PURCHASE_DATE = new Date(2023)

const customerShippingZone = ShippingZone.create("Valencia", "valencia", MOCK_SHIPPING_COST, "active", customerShippingZoneRadio, TUESDAY)
mockShippingZoneRepository.save(customerShippingZone)


describe("Skip Order Use case", () => {
    describe("Given a user with 1 main plan subscription", () => {
        let createSubscriptionDto: any
        let firstSubscriptionResult: any

        beforeAll(async () => {
            createSubscriptionDto = {
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
                purchaseDate: new Date(2023, 7, 3, 10, 0, 0)
            }


            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
        })

        describe("When the user skips 1 order", () => {
            let skippedOrder: Order

            beforeAll(async () => {
                const orders = (await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                skippedOrder = orders[3]
                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [skippedOrder.id.toString()],
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: new Date()

                })
            })

            it("Should set the order state to ORDER_SKIPPED", async () => {
                const order: Order | undefined = await mockOrderRepository.findById(skippedOrder.id, Locale.es)
                expect(order).toBeDefined()
                expect(order!.isSkipped()).toBe(true)
            })

            it("Should set the state of its payment order to PAYMENT_ORDER_SKIPPED", async () => {
                const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(skippedOrder.paymentOrderId!, Locale.es)
                expect(paymentOrder).toBeDefined()
                expect(paymentOrder!.isCancelled()).toBe(true)
            })

            it("Should set the amount of the payment order to 0", async () => {
                const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(skippedOrder!.paymentOrderId!, Locale.es)
                expect(paymentOrder!.amount).toBe(0)

            })

            it("Should leave the shipping cost of the payment order as it was", async () => {
                const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(skippedOrder!.paymentOrderId!, Locale.es)
                expect(paymentOrder!.shippingCost).toBe(MOCK_SHIPPING_COST)
            })

            it("Should set the final amount of the payment order equal to the shipping cost", async () => {
                const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(skippedOrder!.paymentOrderId!, Locale.es)
                expect(paymentOrder!.getFinalAmount()).toBe(MOCK_SHIPPING_COST)
            })
        })

        describe("When the user reactivate the skipped order", () => {
            let skippedOrder: Order

            beforeAll(async () => {
                const orders = (await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                skippedOrder = orders[3]
                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [skippedOrder.id.toString()],
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: new Date()

                })

                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [],
                    ordersToReactivate: [skippedOrder.id.toString()],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: new Date()
                })

            })

            it("Should have all of the 11 orders in the state ORDER_ACTIVE, not counting the billed order", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const activeOrders = orders.filter((order) => order.isActive())
                expect(activeOrders.length).toBe(11)
                expect(activeOrders.every((order) => order.isActive())).toBe(true)
            })

            it("Should have all of the 11 payment orders in the state PAYMENT_ORDER_ACTIVE, not counting the billed payment order", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const paymentOrders = await mockPaymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!))
                const activePaymentOrders = paymentOrders.filter((paymentOrder) => paymentOrder.isActive())
                expect(activePaymentOrders.every((paymentOrder) => paymentOrder.isActive())).toBe(true)
                expect(activePaymentOrders.length).toBe(11)
            })

            it("Should have all of its payment orders with the same amount as the plan variant price", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const paymentOrders = await mockPaymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!))
                expect(paymentOrders.every((paymentOrder) => paymentOrder.amount === planGourmetVariant2Persons2Recipes.getPaymentPrice())).toBe(true)
            })

            it("Should have all of its payment orders with the same shipping cost as the shipping zone", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const paymentOrders = await mockPaymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!))
                expect(paymentOrders.every((paymentOrder) => paymentOrder.shippingCost === MOCK_SHIPPING_COST)).toBe(true)
            })

            afterAll(async () => {
                mockOrderRepository.$orders = []
                mockPaymentOrderRepository.$paymentOrders = []
                mockSubscriptionRepository.$subscriptions = []
            })

        })

        describe("When the user skips 5 orders", () => {
            let skippedOrders: Order[]

            beforeAll(async () => {
                firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
                const orders = (await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                skippedOrders = [orders[3], orders[4], orders[7], orders[11], orders[10]]
                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: skippedOrders.map((order) => order.id.toString()),
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: new Date()

                })

            })
            it("Should set the order state to ORDER_SKIPPED to each of them", async () => {
                const skippedOrdersFromDb = await mockOrderRepository.findByIdList(skippedOrders.map((order) => order.id), Locale.es)

                expect(skippedOrdersFromDb.every((order) => order.isSkipped())).toBe(true)
            })

            it("Should set the state of its payment order to PAYMENT_ORDER_SKIPPED", async () => {
                const skippedOrdersFromDb = await mockOrderRepository.findByIdList(skippedOrders.map((order) => order.id), Locale.es)
                const paymentOrders = await mockPaymentOrderRepository.findByIdList(skippedOrdersFromDb.map((order) => order.paymentOrderId!))

                expect(paymentOrders.every((paymentOrder) => paymentOrder.isCancelled())).toBe(true)
            })

            it("Should set the amount of the payment orders to 0", async () => {
                const skippedOrdersFromDb = await mockOrderRepository.findByIdList(skippedOrders.map((order) => order.id), Locale.es)
                const paymentOrders = await mockPaymentOrderRepository.findByIdList(skippedOrdersFromDb.map((order) => order.paymentOrderId!))

                expect(paymentOrders.every((paymentOrder) => paymentOrder.amount === 0)).toBe(true)
            })

            it("Should leave the rest of orders in the state ORDER_ACTIVE except for the order with the lowest shipping date wich is billed", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const billedOrders = orders.filter((order) => order.isBilled())
                const activeOrders = orders.filter((order) => order.isActive())

                expect(billedOrders.length).toBe(1)
                expect(activeOrders.length).toBe(orders.length - billedOrders.length - skippedOrders.length)
                expect(activeOrders.every((activeOrder) => !skippedOrders.some((skippedOrder) => skippedOrder.id.equals(activeOrder.id)) && !billedOrders.some((billedOrder) => billedOrder.id.equals(activeOrder.id)))).toBe(true)
            })

            afterAll(async () => {
                mockOrderRepository.$orders = []
                mockPaymentOrderRepository.$paymentOrders = []
                mockSubscriptionRepository.$subscriptions = []
            })
        })

        describe("When the user skips at least 1 billed order", () => {
            let billedOrder: Order

            beforeAll(async () => {
                firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
                billedOrder = firstSubscriptionResult.firstOrder
            })

            it("Should throw an error", async () => {
                expect(skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [billedOrder.id.toString()],
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: new Date()

                })).rejects.toThrow()
            })
        })

        // describe("When the user skips an already skipped order", () => {
        //     const CUSTOMER_ID = new CustomerId()
        //     let customer: Customer
        //     let subscriptionResult: any
        //     let skippedOrder: Order

        // beforeAll(async () => {
        //     customer = Customer.create(
        //         CUSTOMER_EMAIL,
        //         true,
        //         "",
        //         [],
        //         0,
        //         new Date(),
        //         undefined,
        //         undefined,
        //         CUSTOMER_PASSWORD,
        //         "active",
        //         undefined,
        //         undefined,
        //         CUSTOMER_ID
        //     )

        //     await mockCustomerRepository.save(customer)
        //     subscriptionResult = await createSubscriptionUseCase.execute({ ...createSubscriptionDto, customerId: CUSTOMER_ID.toString(), purchaseDate: new Date(2023, 7, 1, 11), })
        //     const orders = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
        //     skippedOrder = orders[3]
        // })
        // })

        describe("When the user skips the next active order with a recipe selection", () => {
            let skippedOrder: Order
            let paymentOrderAmount: number | undefined
            const PURCHASE_DATE = new Date("2023-08-08")
            const CHOOSING_DATE = new Date("2023-08-16")
            const SKIPPING_DATE = new Date("2023-08-17")

            beforeAll(async () => {
                firstSubscriptionResult = await createSubscriptionUseCase.execute({ ...createSubscriptionDto, purchaseDate: PURCHASE_DATE })
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                skippedOrder = orders.find((order) => order.isActive())!

                const burguerHalloumiOriginalWeeks = [...burgerHallouli.availableWeeks]
                burgerHallouli.availableWeeks = [skippedOrder.week]

                await chooseRecipesForOrderUseCase.execute({ choosingDate: CHOOSING_DATE, isAdminChoosing: false, orderId: skippedOrder.id.toString(), recipeSelection: [{ quantity: 2, recipeId: burgerHallouli.id.toString(), recipeVariantId: burgerHallouli.recipeVariants[0].id.toString() }] })

                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [skippedOrder.id.toString()],
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: SKIPPING_DATE
                })
                paymentOrderAmount = (await mockPaymentOrderRepository.findById(skippedOrder.paymentOrderId!, Locale.es))?.amount
            })

            it("Should leave the skipped order in ORDER_SKIPPED", async () => {
                const order: Order | undefined = await mockOrderRepository.findById(skippedOrder.id, Locale.es)
                expect(order).toBeDefined()
                expect(order!.isSkipped()).toBe(true)
            })

            it("Should leave the related payment order as it was after the first skip", async () => {
                const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(skippedOrder.paymentOrderId!, Locale.es)
                expect(paymentOrder).toBeDefined()
                expect(paymentOrder!.amount).toBe(paymentOrderAmount)


            })

            it("Should leave the recipe selection in the order", async () => {
                expect(skippedOrder.recipeSelection).toBeDefined()
                expect(skippedOrder.recipeSelection.length).toBe(1)
                expect(skippedOrder.recipeSelection[0].recipe.id.toString()).toBe(burgerHallouli.id.toString())
                expect(skippedOrder.recipeSelection[0].recipeVariantId.toString()).toBe(burgerHallouli.recipeVariants[0].id.toString())
                expect(skippedOrder.recipeSelection[0].quantity).toBe(2)
            })

            it("Should remove the shipping date of the recipe ratings", async () => {
                const recipeRatings: RecipeRating[] = await mockRecipeRatingRepository.findAllByCustomer(CUSTOMER_ID, Locale.es)

                expect(recipeRatings.length).toBe(1)
                expect(recipeRatings[0].shippingDates.length).toBe(0)
            })

            it("Should add the shipping date to the recipe rating if the order is reactivated", async () => {
                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [],
                    ordersToReactivate: [skippedOrder.id.toString()],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: SKIPPING_DATE

                })

                const recipeRatings: RecipeRating[] = await mockRecipeRatingRepository.findAllByCustomer(CUSTOMER_ID, Locale.es)

                expect(recipeRatings.length).toBe(1)
                expect(recipeRatings[0].shippingDates.length).toBe(1)
                expect(recipeRatings[0].shippingDates[0].getTime()).toBe(skippedOrder.shippingDate.getTime())
            })

            it("Should have the recipe selection in the order after the reactivation", async () => {
                const order: Order | undefined = await mockOrderRepository.findById(skippedOrder.id, Locale.es)
                expect(order).toBeDefined()
                expect(order!.recipeSelection).toBeDefined()
                expect(order!.recipeSelection.length).toBe(1)
                expect(order!.recipeSelection[0].recipe.id.toString()).toBe(burgerHallouli.id.toString())
                expect(order!.recipeSelection[0].recipeVariantId.toString()).toBe(burgerHallouli.recipeVariants[0].id.toString())
                expect(order!.recipeSelection[0].quantity).toBe(2)
            })
        })


        describe("When the user skips an order after Friday 23:59", () => {
            const CUSTOMER_ID = new CustomerId()
            let customer: Customer
            let subscriptionResult: any

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
                subscriptionResult = await createSubscriptionUseCase.execute({ ...createSubscriptionDto, customerId: CUSTOMER_ID.toString(), purchaseDate: new Date(2023, 7, 1, 11) })
            })

            it("Should throw an error", async () => {
                const orderToSkip = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]

                expect(skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [orderToSkip.id.toString()],
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: new Date(2023, 7, 12, 0, 0, 0)

                })).rejects.toThrow()
            })
        })



        describe("Given a user with 1 main plan subscription and 1 additional plan subscription", () => {
            let CUSTOMER_ID = new CustomerId()
            let CUSTOMER = Customer.create(CUSTOMER_EMAIL, true, "", [], 0, new Date(), undefined, undefined, CUSTOMER_PASSWORD, "active", undefined, undefined, CUSTOMER_ID)
            let MAIN_PLAN_PURCHASE_DATE = new Date(2023, 7, 15, 11)
            let ADDITIONAL_PURCHASE_DATE = new Date(2023, 7, 15, 12)
            let MAIN_PLAN_SUBSCRIPTION_DTO: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                addressDetails: CUSTOMER_ADDRESS_DETAILS,
                addressName: CUSTOMER_ADDRESS_NAME,
                customerFirstName: CUSTOMER_FIRST_NAME,
                customerLastName: CUSTOMER_LAST_NAME,
                latitude: CUSTOMER_LATITUDE,
                longitude: CUSTOMER_LONGITUDE,
                purchaseDate: MAIN_PLAN_PURCHASE_DATE,
                locale: Locale.es,
                paymentMethodId: "string",
                phone1: CUSTOMER_PHONE,
                planFrequency: "weekly",
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                restrictionComment: "",
                shippingCity: "Alboraya",
                shippingCountry: "España",
                shippingPostalCode: "46120",
                shippingProvince: "Valencia",
                stripePaymentMethodId: ""
            }

            let ADDITIONAL_PLAN_SUBSCRIPTION_DTO: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                addressDetails: CUSTOMER_ADDRESS_DETAILS,
                addressName: CUSTOMER_ADDRESS_NAME,
                customerFirstName: CUSTOMER_FIRST_NAME,
                customerLastName: CUSTOMER_LAST_NAME,
                latitude: CUSTOMER_LATITUDE,
                longitude: CUSTOMER_LONGITUDE,
                purchaseDate: ADDITIONAL_PURCHASE_DATE,
                locale: Locale.es,
                paymentMethodId: "string",
                phone1: CUSTOMER_PHONE,
                planFrequency: "weekly",
                planId: planAdicionalFrutas.id.toString(),
                planVariantId: planAdicionalFrutasVariante1.id.toString(),
                restrictionComment: "",
                shippingCity: "Alboraya",
                shippingCountry: "España",
                shippingPostalCode: "46120",
                shippingProvince: "Valencia",
                stripePaymentMethodId: ""
            }
            let mainPlanSubscriptionResult: any;
            let additionalPlanSubscriptionResult: any;

            beforeAll(async () => {
                await mockCustomerRepository.save(CUSTOMER)
                mainPlanSubscriptionResult = await createSubscriptionUseCase.execute(MAIN_PLAN_SUBSCRIPTION_DTO)
                additionalPlanSubscriptionResult = await createSubscriptionUseCase.execute(ADDITIONAL_PLAN_SUBSCRIPTION_DTO)
            })

            describe("When it skips a main plan order", () => {
                const SKIPPING_DATE = new Date(2023, 7, 23, 11)
                let skippedMainOrder: Order

                beforeAll(async () => {
                    skippedMainOrder = (await mockOrderRepository.findAllBySubscriptionId(mainPlanSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]
                    await skipOrderUseCase.execute({
                        locale: Locale.es,
                        ordersToSkip: [skippedMainOrder.id.toString()],
                        ordersToReactivate: [],
                        nameOrEmailOfAdminExecutingRequest: "",
                        queryDate: SKIPPING_DATE
                    })
                })

                it("Should skip the additional plan order as well", async () => {
                    const skippedAdditionalOrder: Order = (await mockOrderRepository.findAllBySubscriptionId(additionalPlanSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]
                    expect(skippedAdditionalOrder.isSkipped).toBeTruthy()
                })

                it("Should leave the related payment order amount equal to 0", async () => {
                    const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedMainOrder.paymentOrderId!)
                    expect(paymentOrder.amount).toBe(0)
                })

                it("Should leave the related payment order status as 'PAYMENT_ORDER_CANCELLED'", async () => {
                    const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedMainOrder.paymentOrderId!)
                    expect(paymentOrder.isCancelled()).toBeTruthy()

                })
            })

            describe("When it skips an additional plan order", () => {
                const SKIPPING_DATE = new Date(2023, 7, 24, 11)
                let skippedAdditionalOrder: Order

                beforeAll(async () => {
                    skippedAdditionalOrder = (await mockOrderRepository.findAllBySubscriptionId(additionalPlanSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[2]
                    await skipOrderUseCase.execute({
                        locale: Locale.es,
                        ordersToSkip: [skippedAdditionalOrder.id.toString()],
                        ordersToReactivate: [],
                        nameOrEmailOfAdminExecutingRequest: "",
                        queryDate: SKIPPING_DATE
                    })
                })

                it("Should not skip the main plan order", async () => {
                    const mainOrder: Order = (await mockOrderRepository.findAllBySubscriptionId(mainPlanSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[2]
                    expect(mainOrder.isSkipped()).toBeFalsy()
                })

                it("Should leave the related payment order amount equal to the main plan price", async () => {
                    const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedAdditionalOrder.paymentOrderId!)
                    expect(paymentOrder.amount).toBe(planGourmetVariant2Persons2Recipes.getPaymentPrice())
                })

                it("Should leave the related payment order status as 'PAYMENT_ORDER_ACTIVE'", async () => {
                    const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedAdditionalOrder.paymentOrderId!)
                    expect(paymentOrder.isActive()).toBeTruthy()
                })
            })

            describe("When it tries to reactivate the skipped order of the additional plan, having the main plan order skipped", () => {
                const SKIPPING_DATE = new Date(2023, 7, 24, 11)
                let skippedMainOrder: Order
                let skippedAdditionalOrder: Order

                beforeAll(async () => {
                    skippedMainOrder = (await mockOrderRepository.findAllBySubscriptionId(mainPlanSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]
                    skippedAdditionalOrder = (await mockOrderRepository.findAllBySubscriptionId(additionalPlanSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]

                    await skipOrderUseCase.execute({
                        locale: Locale.es,
                        nameOrEmailOfAdminExecutingRequest: "",
                        ordersToReactivate: [],
                        ordersToSkip: [skippedMainOrder.id.toString()],
                        queryDate: SKIPPING_DATE
                    })
                    await skipOrderUseCase.execute({
                        locale: Locale.es,
                        nameOrEmailOfAdminExecutingRequest: "",
                        ordersToReactivate: [],
                        ordersToSkip: [skippedAdditionalOrder.id.toString()],
                        queryDate: SKIPPING_DATE
                    })


                })

                it("Should not reactivate the order an error", async () => {
                    await skipOrderUseCase.execute({
                        locale: Locale.es,
                        ordersToSkip: [],
                        ordersToReactivate: [skippedAdditionalOrder.id.toString()],
                        nameOrEmailOfAdminExecutingRequest: "",
                        queryDate: SKIPPING_DATE
                    })
                    expect(skippedAdditionalOrder.isSkipped()).toBeTruthy()
                })
            })
        })
    })


    describe("Given a user with 2 main plan subscriptions", () => {
        const CUSTOMER_ID = new CustomerId()
        const FIRST_SUBSCRIPTION_PURCHASE_DATE = new Date(2023, 7, 15, 11)
        const SECOND_SUBSCRIPTION_PURCHASE_DATE = new Date(2023, 7, 15, 12)
        const SKIPPING_DATE = new Date(2023, 7, 15, 13)
        let firstSubscriptionResult: any
        let secondSubscriptionResult: any


        beforeAll(async () => {
            const customer = Customer.create(
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

            let firstSubscriptionDto: CreateSubscriptionDto = {
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
                purchaseDate: FIRST_SUBSCRIPTION_PURCHASE_DATE
            }
            let secondSubscriptionDto: CreateSubscriptionDto = {
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
                purchaseDate: SECOND_SUBSCRIPTION_PURCHASE_DATE
            }


            firstSubscriptionResult = await createSubscriptionUseCase.execute(firstSubscriptionDto)
            secondSubscriptionResult = await createSubscriptionUseCase.execute(secondSubscriptionDto)
        })

        describe("When it skips an order of the first subscription", () => {
            let skippedOrder: Order

            beforeAll(async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                skippedOrder = orders.sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]

                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [skippedOrder.id.toString()],
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: SKIPPING_DATE
                })
            })
            it("Should rest the first subscription amount to the payment order", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedOrder.paymentOrderId!)

                expect(paymentOrder?.amount).toBe(27.99)
                expect(paymentOrder?.getTotalAmount()).toBe(37.99)
            })

            it("Should leave the shipping cost of the payment order as it was", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedOrder.paymentOrderId!)

                expect(paymentOrder?.shippingCost).toBe(MOCK_SHIPPING_COST)
            })

            it("Should leave the related payment order status as 'PAYMENT_ORDER_ACTIVE'", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedOrder.paymentOrderId!)

                expect(paymentOrder?.isActive()).toBeTruthy()
            })
            it("Should leave the second subscription order status as 'ORDER_ACTIVE'", async () => {
                const nextActiveOrderOfSecondSusbcription: Order = (await mockOrderRepository.findAllBySubscriptionId(secondSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]
                expect(nextActiveOrderOfSecondSusbcription.isActive()).toBeTruthy()
            })
        })

        describe("When it skips an order of the second subscription", () => {
            let skippedOrder: Order
            beforeAll(async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(secondSubscriptionResult.subscription.id)
                skippedOrder = orders.sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]

                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [skippedOrder.id.toString()],
                    ordersToReactivate: [],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: SKIPPING_DATE
                })
            })

            it("Should set the payment order amount to 0", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedOrder.paymentOrderId!)

                expect(paymentOrder?.amount).toBe(0)
                expect(paymentOrder?.getTotalAmount()).toBe(MOCK_SHIPPING_COST)
            })

            it("Should leave the shipping cost of the payment order as it was", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedOrder.paymentOrderId!)

                expect(paymentOrder?.shippingCost).toBe(MOCK_SHIPPING_COST)
            })

            it("Should leave the related payment order status as 'PAYMENT_ORDER_CANCELLED'", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(skippedOrder.paymentOrderId!)

                expect(paymentOrder?.isCancelled()).toBeTruthy()
            })
        })

        describe("When it reactivates the skipped order of the first subscription", () => {
            let orderToReactivate: Order

            beforeAll(async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orderToReactivate = orders.sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]

                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [],
                    ordersToReactivate: [orderToReactivate.id.toString()],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: SKIPPING_DATE
                })
            })

            it("Should set the payment order amount to the plan variant price", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(orderToReactivate.paymentOrderId!)

                expect(paymentOrder?.amount).toBe(27.99)
                expect(paymentOrder?.getTotalAmount()).toBe(37.99)
            })

            it("Should leave the shipping cost of the payment order as it was", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(orderToReactivate.paymentOrderId!)

                expect(paymentOrder?.shippingCost).toBe(MOCK_SHIPPING_COST)
            })

            it("Should leave the related payment order status as 'PAYMENT_ORDER_ACTIVE'", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(orderToReactivate.paymentOrderId!)

                expect(paymentOrder?.isActive()).toBeTruthy()
            })
        })

        describe("When it reactivates the skipped order of the second subscription", () => {
            let orderToReactivate: Order

            beforeAll(async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(secondSubscriptionResult.subscription.id)
                orderToReactivate = orders.sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[1]

                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [],
                    ordersToReactivate: [orderToReactivate.id.toString()],
                    nameOrEmailOfAdminExecutingRequest: "",
                    queryDate: SKIPPING_DATE
                })
            })

            it("Should set the payment order amount to the plan variant price", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(orderToReactivate.paymentOrderId!)

                expect(paymentOrder?.amount).toBe(55.98)
                expect(paymentOrder?.getTotalAmount()).toBe(65.98)
            })

            it("Should leave the shipping cost of the payment order as it was", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(orderToReactivate.paymentOrderId!)

                expect(paymentOrder?.shippingCost).toBe(MOCK_SHIPPING_COST)
            })

            it("Should leave the related payment order status as 'PAYMENT_ORDER_ACTIVE'", async () => {
                const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(orderToReactivate.paymentOrderId!)

                expect(paymentOrder?.isActive()).toBeTruthy()
            })
        })
    })
    describe("Given a user with 2 main plan subscriptions and 1 additional plan subscription", () => { })

})