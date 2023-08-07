jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import { SkipOrders } from "../../../src/bounded_contexts/operations/useCases/skipOrders/skipOrders"
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
import { Plan } from "../../../src/bounded_contexts/operations/domain/plan/Plan"
import { PlanSku } from "../../../src/bounded_contexts/operations/domain/plan/PlanSku"
import { PlanType } from "../../../src/bounded_contexts/operations/domain/plan/PlanType/PlanType"
import { PlanVariant } from "../../../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariant"
import { PlanFrequencyFactory } from "../../../src/bounded_contexts/operations/domain/plan/PlanFrequency/PlanFrequencyFactory"
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale"
import { PlanSlug } from "../../../src/bounded_contexts/operations/domain/plan/PlanSlug"
import { PlanId } from "../../../src/bounded_contexts/operations/domain/plan/PlanId"
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId"
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio"
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates"
import { Day } from "../../../src/bounded_contexts/operations/domain/day/Day"
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode"
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order"
import { PaymentOrder } from "../../../src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder"
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { UpdateDiscountAfterSkippingOrders } from "../../../src/bounded_contexts/operations/services/updateDiscountsAfterSkippingOrders/updateDiscountsAfterSkippingOrders"
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { gourmetPlan, planGourmetVariant2Persons2Recipes } from "../../mocks/plan"
import { TUESDAY } from "../../mocks/days"

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
const mockRecipeRatingRepository = new InMemoryRateRepository([])
const mockLogRepository = new InMemoryLogRepository([])
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const updateDiscountsAfterSKippingOrdersService = new UpdateDiscountAfterSkippingOrders(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockShippingZoneRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const skipOrderUseCase = new SkipOrders(mockOrderRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository, mockSubscriptionRepository, updateDiscountsAfterSKippingOrdersService)

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
                purchaseDate: new Date()
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
                    nameOrEmailOfAdminExecutingRequest: ""

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
                    nameOrEmailOfAdminExecutingRequest: ""

                })

                await skipOrderUseCase.execute({
                    locale: Locale.es,
                    ordersToSkip: [],
                    ordersToReactivate: [skippedOrder.id.toString()],
                    nameOrEmailOfAdminExecutingRequest: ""
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
                    nameOrEmailOfAdminExecutingRequest: ""

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
                    nameOrEmailOfAdminExecutingRequest: ""

                })).rejects.toThrow()
            })
        })

        describe("When the user skips an order after Friday 23:59", () => {
            it("Should throw an error", () => { })
        })



        describe("Given a user with 1 main plan subscription and 1 additional plan subscription", () => { })
        describe("Given a user with 2 main plan subscriptions", () => { })
        describe("Given a user with 2 main plan subscriptions and 1 additional plan subscription", () => { })
    })
})