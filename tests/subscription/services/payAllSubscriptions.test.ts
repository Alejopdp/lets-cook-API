jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import moment from "moment"
import { UpdatePaymentMethod } from "../../../src/bounded_contexts/operations/useCases/updatePaymentMethod/updatePaymentMethod"
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
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
import { MockStorageService } from "../../../src/bounded_contexts/operations/application/storageService/mockStorageService";
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders"
import { PayAllSubscriptions } from "../../../src/bounded_contexts/operations/services/payAllSubscriptions/payAllSubscriptions"
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders"
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer"
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale"
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId"
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio"
import { SkipOrders } from "../../../src/bounded_contexts/operations/useCases/skipOrders/skipOrders"
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates"
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode"
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order"
import { PaymentOrder } from "../../../src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder"
import { CreateSubscriptionDto } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscriptionDto"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { gourmetPlan, planGourmetVariant2Persons2Recipes } from "../../mocks/plan"
import { TUESDAY } from "../../mocks/days"
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod"
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository"
import { UpdateDiscountAfterSkippingOrders } from "../../../src/bounded_contexts/operations/services/updateDiscountsAfterSkippingOrders/updateDiscountsAfterSkippingOrders"
import { IStorageService } from "../../../src/bounded_contexts/operations/application/storageService/IStorageService"
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum"

const mockStorageService: IStorageService = new MockStorageService()
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
const mockLogRepository = new InMemoryLogRepository([])
const mockRecipeRatingRepository = new InMemoryRateRepository([])
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const updateDiscountAfterSkippingOrders = new UpdateDiscountAfterSkippingOrders(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockShippingZoneRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)

mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => ({
    client_secret: "client_secret",
    id: "id",
    status: "succeeded",
    amount: 0
}))

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

const billingJob = new PayAllSubscriptions(mockCustomerRepository, mockOrderRepository, mockPaymentOrderRepository, mockPaymentService, mockSubscriptionRepository, mockWeekRepository, mockShippingZoneRepository, mockNotificationService)

describe("Saturday billing job", () => {
    describe("Given one customer with a weekly subscription", () => {
        const CUSTOMER_ID = new CustomerId()
        const PURCHASE_DATE = new Date(2023, 7, 24, 17)
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
            const paymentMethod = new PaymentMethod("Visa", "4232", 8, 2030, "475", true, "stripe_id")
            customer.addPaymentMethod(paymentMethod)

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
        })

        describe("When the billing job is executed and it has an active order", () => {
            const EXECUTION_DATE = new Date(2023, 8, 2, 4)

            beforeAll(async () => {

                //@ts-ignore
                mockPaymentService.paymentIntent.mockImplementationOnce(async (): Promise<PaymentIntent> => ({
                    status: "succeeded",
                    client_secret: "client_secret",
                    id: "payment_intent_id",
                    amount: 0
                }))

                await billingJob.execute({ executionDate: EXECUTION_DATE })
            })

            it("Should bill the the payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.state.isBilled()).toBe(true)
            })

            it("Should create a new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[12]

                expect(paymentOrders.length).toBe(13)
                expect(paymentOrderToCheck.state.isActive()).toBeTruthy()
                expect(paymentOrderToCheck.billingDate).toEqual(moment(paymentOrders[1].billingDate).add(11, "week").toDate())
            })
            it("Should bill the related order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
                const orderToCheck = orders[1]

                expect(orderToCheck.state.isBilled()).toBeTruthy()
            })

            it("Should assign the payment intent id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.paymentIntentId).toEqual("payment_intent_id")
            })

            it("Should create a new order", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const orderToCheck = orders[12]

                expect(orders.length).toBe(13)
                expect(orderToCheck.state.isActive()).toBeTruthy()
                expect(orderToCheck.shippingDate).toEqual(moment(orders[0].shippingDate).add(12, "week").toDate())
            })

            it("Should assign the new order to the new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[12].paymentOrderId?.equals(paymentOrders[12].id)).toBe(true)
            })

            it("Should assign a human id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.humanId).toBeDefined()
            })

            it("Should pass the correct amount to bill to the payment service", async () => {
                expect(mockPaymentService.paymentIntent).toHaveBeenCalledWith(37.99, "stripe_id", CUSTOMER_EMAIL, "", true)
            })

            afterAll(async () => {
                // Delete all customer payment orders but leave the rest ones
                mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder: PaymentOrder) => !paymentOrder.customerId.equals(CUSTOMER_ID))
                mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order: Order) => !order.customer.id.equals(CUSTOMER_ID))
                mockSubscriptionRepository.$subscriptions = mockSubscriptionRepository.$subscriptions.filter((subscription: Subscription) => !subscription.customer.id.equals(CUSTOMER_ID))
            })
        })

        describe("When the billing job is executed and it has a skipped order", () => {
            const EXECUTION_DATE = new Date(2023, 8, 2, 4)

            beforeAll(async () => {
                mockPaymentService.paymentIntent.mockClear()

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
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const secondOrder = orders[1]
                const skipOrders = new SkipOrders(mockOrderRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository, mockSubscriptionRepository, updateDiscountAfterSkippingOrders)
                await skipOrders.execute({ locale: Locale.es, nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: [], ordersToSkip: [secondOrder.id.toString()], queryDate: PURCHASE_DATE })
                await billingJob.execute({ executionDate: EXECUTION_DATE })

            })

            it("Should leave the paymentOrder cancelled", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.state.isCancelled()).toBe(true)
            })

            it("Should not assign the payment intent id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.paymentIntentId).toEqual("")
            })

            it("Should create a new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[12]

                expect(paymentOrders.length).toBe(13)
                expect(paymentOrderToCheck.state.isActive()).toBeTruthy()
                expect(paymentOrderToCheck.billingDate).toEqual(moment(paymentOrders[1].billingDate).add(11, "week").toDate())
            })

            it("Should leave the order skipped", async () => {
                const orders: Order[] = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
                const orderToCheck = orders[1]

                expect(orderToCheck.state.isSkipped()).toBeTruthy()
            })

            it("Should create a new order", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const orderToCheck = orders[12]

                expect(orders.length).toBe(13)
                expect(orderToCheck.state.isActive()).toBeTruthy()
                expect(orderToCheck.shippingDate).toEqual(moment(orders[0].shippingDate).add(12, "week").toDate())
            })
            it("Should assign the new order to the new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[12].paymentOrderId?.equals(paymentOrders[12].id)).toBe(true)
            })

            it("Should not assign a human id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.humanId).not.toBeDefined()
            })

            it("Should not call the payment service", async () => {
                expect(mockPaymentService.paymentIntent).not.toHaveBeenCalled()
            })

            afterAll(async () => {
                // Delete all customer payment orders but leave the rest ones
                mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder: PaymentOrder) => !paymentOrder.customerId.equals(CUSTOMER_ID))
                mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order: Order) => !order.customer.id.equals(CUSTOMER_ID))
                mockSubscriptionRepository.$subscriptions = mockSubscriptionRepository.$subscriptions.filter((subscription: Subscription) => !subscription.customer.id.equals(CUSTOMER_ID))
            })

        })

        describe("When the job is executed and the amount to bill is less than 0.5", () => {
            const EXECUTION_DATE = new Date(2023, 8, 2, 4)

            beforeAll(async () => {
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
                mockPaymentService.paymentIntent.mockClear()

                const paymentOrderToBill: PaymentOrder = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())[1]
                paymentOrderToBill.discountAmount = 37.99
                await billingJob.execute({ executionDate: EXECUTION_DATE })
            })

            it("Should bill the the payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.state.isBilled()).toBe(true)
            })

            it("Should create a new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[12]

                expect(paymentOrders.length).toBe(13)
                expect(paymentOrderToCheck.state.isActive()).toBeTruthy()
                expect(paymentOrderToCheck.billingDate).toEqual(moment(paymentOrders[1].billingDate).add(11, "week").toDate())
            })
            it("Should bill the related order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
                const orderToCheck = orders[1]

                expect(orderToCheck.state.isBilled()).toBeTruthy()
            })

            it("Should not assign the payment intent id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.paymentIntentId).toEqual("")
            })

            it("Should create a new order", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const orderToCheck = orders[12]

                expect(orders.length).toBe(13)
                expect(orderToCheck.state.isActive()).toBeTruthy()
                expect(orderToCheck.shippingDate).toEqual(moment(orders[0].shippingDate).add(12, "week").toDate())
            })

            it("Should assign the new order to the new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[12].paymentOrderId?.equals(paymentOrders[12].id)).toBe(true)
            })

            it("Should assign a human id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.humanId).toBeDefined()
            })

            it("Should not call the payment service", async () => {
                expect(mockPaymentService.paymentIntent).not.toHaveBeenCalled()
            })

            afterAll(async () => {
                // Delete all customer payment orders but leave the rest ones
                mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder: PaymentOrder) => !paymentOrder.customerId.equals(CUSTOMER_ID))
                mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order: Order) => !order.customer.id.equals(CUSTOMER_ID))
                mockSubscriptionRepository.$subscriptions = mockSubscriptionRepository.$subscriptions.filter((subscription: Subscription) => !subscription.customer.id.equals(CUSTOMER_ID))
            })


        })

        describe("When the job is executed and the customer doesn't have enough money", () => {
            const EXECUTION_DATE = new Date(2023, 8, 2, 4)

            beforeAll(async () => {
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
                mockPaymentService.paymentIntent.mockClear()
                //@ts-ignore
                mockPaymentService.paymentIntent.mockImplementationOnce(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
                    status: "cancelled",
                    client_secret: "client_secret",
                    id: "payment_intent_id",
                    amount: 0
                }))

                const payAllSubscriptions = new PayAllSubscriptions(mockCustomerRepository, mockOrderRepository, mockPaymentOrderRepository, mockPaymentService, mockSubscriptionRepository, mockWeekRepository, mockShippingZoneRepository, mockNotificationService)

                await payAllSubscriptions.execute({ executionDate: EXECUTION_DATE })

            })
            it("Should set the payment order state to rejected", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.state.title).toBe("PAYMENT_ORDER_REJECTED")
                expect(paymentOrderToCheck.isPaymentRejected()).toBe(true)
            })

            it("Should assign the payment intent id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.paymentIntentId).toEqual("payment_intent_id")
            })

            it("Should create a new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const paymentOrderToCheck = paymentOrders[12]

                expect(paymentOrders.length).toBe(13)
                expect(paymentOrderToCheck.state.isActive()).toBeTruthy()
                expect(paymentOrderToCheck.billingDate).toEqual(moment(paymentOrders[1].billingDate).add(11, "week").toDate())
            })

            it("Should leave the order in rejected", async () => {
                const orders: Order[] = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
                const orderToCheck = orders[1]

                expect(orderToCheck.state.isPaymentRejected()).toBeTruthy()
            })

            it("Should create a new order", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                const orderToCheck = orders[12]

                expect(orders.length).toBe(13)
                expect(orderToCheck.state.isActive()).toBeTruthy()
                expect(orderToCheck.shippingDate).toEqual(moment(orders[0].shippingDate).add(12, "week").toDate())
            })

            it("Should assign the new order to the new payment order", async () => {
                const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[12].paymentOrderId?.equals(paymentOrders[12].id)).toBe(true)
            })

            it("Should not assign a human id to the payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const paymentOrderToCheck = paymentOrders[1]

                expect(paymentOrderToCheck.humanId).not.toBeDefined()
            })

            it("Should pass the correct amount to bill to the payment service", async () => {
                expect(mockPaymentService.paymentIntent).toHaveBeenCalledWith(37.99, "stripe_id", CUSTOMER_EMAIL, "", true)
            })

            afterAll(async () => {
                mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder: PaymentOrder) => !paymentOrder.customerId.equals(CUSTOMER_ID))
                mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order: Order) => !order.customer.id.equals(CUSTOMER_ID))
                mockSubscriptionRepository.$subscriptions = mockSubscriptionRepository.$subscriptions.filter((subscription: Subscription) => !subscription.customer.id.equals(CUSTOMER_ID))
            })

        })

        describe("When the job is executed and the customer has his wallet as payment method", () => {
            const EXECUTION_DATE = new Date(2023, 8, 2, 4)
            const GOOD_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }]

            beforeAll(async () => {

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


                const createWallet = new CreateWallet(mockCustomerRepository)
                const chargeMoneyToWalletUseCase = new ChargeMoneyToWallet(mockPaymentService)
                const chargeMoneyToWallet = new ChargeMoneyToWalletUseCase(mockCustomerRepository, chargeMoneyToWalletUseCase)
                const updatePaymentMethodUseCase = new UpdatePaymentMethod(mockCustomerRepository, mockStorageService, mockLogRepository)

                mockPaymentService.paymentIntent.mockClear()
                //@ts-ignore
                mockPaymentService.paymentIntent.mockImplementationOnce(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
                    status: "succeeded",
                    client_secret: "client_secret",
                    id: "id",
                    amount: 0
                }))
                await createWallet.execute({ amountToCharge: 100, customerId: CUSTOMER_ID.toString(), datesOfCharge: GOOD_DATES_OF_CHARGE, paymentMethodForCharging: customer.getDefaultPaymentMethod()?.id.toString() ?? "", locale: Locale.es })
                await chargeMoneyToWallet.execute({ customerId: CUSTOMER_ID.toString(), amountToCharge: 100, locale: Locale.es })
                await updatePaymentMethodUseCase.execute({ brand: "", customerId: CUSTOMER_ID.toString(), cvc: "", exp_month: 8, exp_year: 2030, isDefault: true, last4Numbers: "", nameOrEmailOfAdminExecutingRequest: "", paymentId: "wallet", stripeId: "" })

            })

            describe("When the wallet has enough money and the customer has an active order", () => {
                beforeAll(async () => {
                    mockPaymentService.paymentIntent.mockClear()
                    //@ts-ignore
                    mockPaymentService.paymentIntent.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
                        status: "succeeded",
                        client_secret: "client_secret",
                        id: "id",
                        amount: 0
                    }))
                    await billingJob.execute({ executionDate: EXECUTION_DATE })
                })

                it("Should bill the the payment order", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const paymentOrderToCheck = paymentOrders[1]

                    expect(paymentOrderToCheck.state.isBilled()).toBe(true)
                })

                it("Should create a new payment order", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const paymentOrderToCheck = paymentOrders[12]

                    expect(paymentOrders.length).toBe(13)
                    expect(paymentOrderToCheck.state.isActive()).toBeTruthy()
                    expect(paymentOrderToCheck.billingDate).toEqual(moment(paymentOrders[1].billingDate).add(11, "week").toDate())
                })
                it("Should bill the related order", async () => {
                    const orders: Order[] = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
                    const orderToCheck = orders[1]

                    expect(orderToCheck.state.isBilled()).toBeTruthy()
                })

                it("Should assign the string 'Monedero' as the payment intent id to the payment order", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const paymentOrderToCheck = paymentOrders[1]

                    expect(paymentOrderToCheck.paymentIntentId).toEqual("Monedero")
                })

                it("Should create a new order", async () => {
                    const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                    const orderToCheck = orders[12]

                    expect(orders.length).toBe(13)
                    expect(orderToCheck.state.isActive()).toBeTruthy()
                    expect(orderToCheck.shippingDate).toEqual(moment(orders[0].shippingDate).add(12, "week").toDate())
                })

                it("Should assign the new order to the new payment order", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                    expect(orders[12].paymentOrderId?.equals(paymentOrders[12].id)).toBe(true)
                })

                it("Should assign a human id to the payment order", async () => {
                    const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                    const paymentOrderToCheck = paymentOrders[1]

                    expect(paymentOrderToCheck.humanId).toBeDefined()
                })

                it("Should rest the wallet balance", async () => {
                    expect(customer.wallet?.balance).toBe(62.01)
                })

                it("Should not call the payment service", async () => {
                    expect(mockPaymentService.paymentIntent).not.toHaveBeenCalled()
                })

                it("Should create a wallet movement log", async () => {
                    expect(customer.wallet?.walletMovements.filter(log => log.type === WalletMovementLogType.PAY_SATURDAY_JOB_WITH_WALLET).length).toBe(1)
                })

                afterAll(async () => {
                    mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder: PaymentOrder) => !paymentOrder.customerId.equals(CUSTOMER_ID))
                    mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order: Order) => !order.customer.id.equals(CUSTOMER_ID))
                    mockSubscriptionRepository.$subscriptions = mockSubscriptionRepository.$subscriptions.filter((subscription: Subscription) => !subscription.customer.id.equals(CUSTOMER_ID))
                })

            })

            describe("When the wallet has not enough money and the customer has an active order", () => {
                beforeAll(async () => {
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
                    mockPaymentService.paymentIntent.mockClear()
                    //@ts-ignore
                    mockPaymentService.paymentIntent.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
                        status: "succeeded",
                        client_secret: "client_secret",
                        id: "id",
                        amount: 0
                    }))

                    if (customer.wallet) customer.wallet.balance = 15
                    await billingJob.execute({ executionDate: EXECUTION_DATE })
                })

                it("Should set the payment order to rejected", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const paymentOrderToCheck = paymentOrders[1]

                    expect(paymentOrderToCheck.state.isRejected()).toBe(true)
                })

                it("Should create a new payment order", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const paymentOrderToCheck = paymentOrders[12]

                    expect(paymentOrders.length).toBe(13)
                    expect(paymentOrderToCheck.state.isActive()).toBeTruthy()
                    expect(paymentOrderToCheck.billingDate).toEqual(moment(paymentOrders[1].billingDate).add(11, "week").toDate())
                })
                it("Should set the related order as rejected", async () => {
                    const orders: Order[] = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
                    const orderToCheck = orders[1]

                    expect(orderToCheck.state.isPaymentRejected()).toBeTruthy()
                })

                it("Should assign the string 'Monedero' as the payment intent id to the payment order", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const paymentOrderToCheck = paymentOrders[1]

                    expect(paymentOrderToCheck.paymentIntentId).toEqual("Monedero")
                })

                it("Should not assign a human ID to the payment order", async () => {
                    const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                    const paymentOrderToCheck = paymentOrders[1]

                    expect(paymentOrderToCheck.humanId).not.toBeDefined()
                })

                it("Should create a new order", async () => {
                    const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                    const orderToCheck = orders[12]

                    expect(orders.length).toBe(13)
                    expect(orderToCheck.state.isActive()).toBeTruthy()
                    expect(orderToCheck.shippingDate).toEqual(moment(orders[0].shippingDate).add(12, "week").toDate())
                })

                it("Should assign the new order to the new payment order", async () => {
                    const paymentOrders: PaymentOrder[] = (await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)).sort((a: PaymentOrder, b: PaymentOrder) => a.billingDate.getTime() - b.billingDate.getTime())
                    const orders: Order[] = (await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)).sort((a: Order, b: Order) => a.shippingDate.getTime() - b.shippingDate.getTime())
                    expect(orders[12].paymentOrderId?.equals(paymentOrders[12].id)).toBe(true)
                })

                it("Should not rest the wallet balance", async () => {
                    expect(customer.wallet?.balance).toBe(15)
                })

                it("Should not call the payment service", async () => {
                    expect(mockPaymentService.paymentIntent).not.toHaveBeenCalled()
                })

                afterAll(async () => {
                    mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder: PaymentOrder) => !paymentOrder.customerId.equals(CUSTOMER_ID))
                    mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order: Order) => !order.customer.id.equals(CUSTOMER_ID))
                    mockSubscriptionRepository.$subscriptions = mockSubscriptionRepository.$subscriptions.filter((subscription: Subscription) => !subscription.customer.id.equals(CUSTOMER_ID))
                })

            })
        })

    })
})