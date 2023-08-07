jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import { CreateSubscription } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
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
import { gourmetPlan, gourmetPlanSku, planGourmetVariant2Persons2Recipes, planGourmetVariant2Persons3Recipes } from "../../mocks/plan"
import { TUESDAY, WEDNESDAY } from "../../mocks/days"

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
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)

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


describe("Create Subscription Use Case", () => {
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

    describe("It creates a new weekly subscription for a first-time customer", () => {

        describe("Subscription validation", () => {
            it("Should create the subscription with the created date as the purchase date", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.createdAt.getDay()).toEqual(createSubscriptionDto.purchaseDate.getDay())
                expect(subscription.createdAt.getMonth()).toEqual(createSubscriptionDto.purchaseDate.getMonth())
                expect(subscription.createdAt.getFullYear()).toEqual(createSubscriptionDto.purchaseDate.getFullYear())
            })

            it("Should have a restriction comment", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.restrictionComment).toBe(createSubscriptionDto.restrictionComment)
            })

            it("Should have the planId", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.plan.id).toEqual(gourmetPlan.id)
            })

            it("Should have the planSku", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.plan.planSku).toEqual(gourmetPlanSku)
            })

            it("Should have the planName", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.plan.name).toEqual(gourmetPlan.name)
            })

            it("Should have the planVariantId", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.planVariantId).toEqual(planGourmetVariant2Persons2Recipes.id)
            })

            it("Should have the planVariantSku", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                const planVariant = subscription.plan.getPlanVariantById(subscription.planVariantId)
                expect(planVariant?.sku).toEqual(planGourmetVariant2Persons2Recipes.sku)
            })

            it("Should have the plan variant description", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                const planVariant = subscription.plan.getPlanVariantById(subscription.planVariantId)
                expect(planVariant?.description).toEqual(planGourmetVariant2Persons2Recipes.description)
            })

            it("Should have the plan variant price", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.price).toEqual(planGourmetVariant2Persons2Recipes.getPaymentPrice())
            })


        })

        describe("Use case response", () => {
            it("Should return a subscription", () => {
                expect(firstSubscriptionResult).toBeDefined()
                expect(firstSubscriptionResult).toHaveProperty("subscription")
            })


            it("Should return the first order", () => {
                expect(firstSubscriptionResult).toHaveProperty("firstOrder")
            })

            it("Should return the customer payment methods", () => {
                expect(firstSubscriptionResult).toHaveProperty("customerPaymentMethods")
            })

            it("Should return a billed amount", () => {
                expect(firstSubscriptionResult).toHaveProperty("amountBilled")
            })

            it("Should return the tax", () => {
                expect(firstSubscriptionResult).toHaveProperty("tax")
            })

            it("Should return the shipping cost", () => {
                expect(firstSubscriptionResult).toHaveProperty("shippingCost")
            })

            it("Should return the payment order human id", () => {
                expect(firstSubscriptionResult).toHaveProperty("billedPaymentOrderHumanId")
            })
        })

        describe("Orders validation", () => {
            it("Should create 12 orders", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                expect(orders.length).toBe(12)
            })

            it("Should bill the first order", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const firstOrder: Order = orders[0]
                expect(firstOrder.isBilled()).toBe(true)
            })

            // El resto tiene que estar en activas

            it("Should have no discount on any order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach((order) => {
                    expect(order.discountAmount).toBe(0)
                }
                )
            })

            it("Should create the shipping dates for the orders as the day of the week of the shipping zone", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach((order) => {
                    expect(order.shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                })
            })

            it("Should create the rest of orders with 7 days of difference as shipping dates", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach((order, index) => {
                    const previousOrder = orders[index - 1]
                    if (previousOrder) {
                        const difference = order.shippingDate.getTime() - previousOrder.shippingDate.getTime()
                        expect(difference).toBe(7 * 24 * 60 * 60 * 1000)
                    }
                })
            })

            it("Should create a payment order for each order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach((order) => {
                    expect(order.paymentOrderId).toBeDefined()
                })
            })

            it("Should create a shipping date after the billing date of each payment order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach(async (order) => {
                    const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(order.paymentOrderId!, Locale.es)
                    expect(order.shippingDate.getTime()).toBeGreaterThan(paymentOrder!.billingDate.getTime())
                })
            })

            it("Should relate a week to each order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach((order) => {
                    expect(order.week).toBeDefined()
                })
            })

        })


        describe("Customer details validation", () => {
            it("Should update the customer name", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                expect(customer.getPersonalInfo().fullName).toBe(`${CUSTOMER_FIRST_NAME} ${CUSTOMER_LAST_NAME}`)
            })

            it("Should update the customer phone", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                expect(customer.getPersonalInfo().phone1).toBe(CUSTOMER_PHONE)
            })

            it("Should update the customer address", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                expect(customer.getShippingAddress().addressName).toBe(CUSTOMER_ADDRESS_NAME)
                expect(customer.getShippingAddress().addressDetails).toBe(CUSTOMER_ADDRESS_DETAILS)
            })

            it("Should update the customer latitude and longitude if changed", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                expect(customer.getShippingAddress().latitude).toBe(CUSTOMER_LATITUDE)
                expect(customer.getShippingAddress().longitude).toBe(CUSTOMER_LONGITUDE)
            })

            it("Should create the friend code for the customer", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
                expect(customer.friendCode).toBeDefined()
            })

        })

        describe("Payment orders validation", () => {

            it("Should create 12 paymnet orders", async () => {
                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                expect(paymentOrders.length).toBe(12)
            })

            it("Should assign saturdays at 00:00 as billing dates for every payment order", async () => {
                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                const restOfPaymentOrders = paymentOrders.slice(1)
                restOfPaymentOrders.forEach((paymentOrder) => {
                    expect(paymentOrder.billingDate.getDay()).toBe(6)
                    expect(paymentOrder.billingDate.getHours()).toBe(0)
                    expect(paymentOrder.billingDate.getMinutes()).toBe(0)
                    expect(paymentOrder.billingDate.getSeconds()).toBe(0)
                })
            })

            it("Should bill the first payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const firstPaymentOrder = paymentOrders[0]
                expect(firstPaymentOrder.isBilled()).toBe(true)
            })

            it("Should assign a stripeId to the first payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const firstPaymentOrder = paymentOrders[0]
                expect(firstPaymentOrder.paymentIntentId).toBeDefined()
                expect(firstPaymentOrder.paymentIntentId).not.toBe("")
            })

            it("Should left the rest of payment orders unbilled", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const restOfPaymentOrders = paymentOrders.slice(1)
                restOfPaymentOrders.forEach((paymentOrder) => {
                    expect(paymentOrder.isActive()).toBe(true)
                })
            })

            it("Should assign an human id to the billed payment order", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const firstPaymentOrder = paymentOrders[0]
                expect(firstPaymentOrder.humanId).toBeDefined()
            })

            it("Should bill the cost of the shipping zone correctly", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const firstPaymentOrder = paymentOrders[0]
                expect(firstPaymentOrder.shippingCost).toBe(MOCK_SHIPPING_COST)
            })

            it("Should bill the cost of the plan variant correctly", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const firstPaymentOrder = paymentOrders[0]
                expect(firstPaymentOrder.amount).toBe(planGourmetVariant2Persons2Recipes.getPaymentPrice())
            })

            it("Should assign the same amount to the rest of payment orders", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const restOfPaymentOrders = paymentOrders.slice(1)
                restOfPaymentOrders.forEach((paymentOrder) => {
                    expect(paymentOrder.amount).toBe(planGourmetVariant2Persons2Recipes.getPaymentPrice())
                })
            })

            it("Should assign the same shipping cost to the rest of payment orders", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const restOfPaymentOrders = paymentOrders.slice(1)
                restOfPaymentOrders.forEach((paymentOrder) => {
                    expect(paymentOrder.shippingCost).toBe(MOCK_SHIPPING_COST)
                })
            })


            it("Should create the rest of payment orders with 7 days of difference as billing dates", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customer.id)
                paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())
                const restOfPaymentOrders = paymentOrders.slice(1)
                restOfPaymentOrders.forEach((paymentOrder, index) => {
                    const previousPaymentOrder = restOfPaymentOrders[index - 1]
                    if (previousPaymentOrder) {
                        const difference = paymentOrder.billingDate.getTime() - previousPaymentOrder.billingDate.getTime()
                        expect(difference).toBe(7 * 24 * 60 * 60 * 1000)
                    }
                })
            })
        })

        it("Should throw an error if the plan variant is not found", async () => {
            const wrongPlanVariantId = "wrongPlanVariantId"
            const newDto = { ...createSubscriptionDto, planVariantId: wrongPlanVariantId }
            await expect(createSubscriptionUseCase.execute(newDto)).rejects.toThrow()
        })

        it("Should throw an error if the customer is not within any shipping zone", async () => {
            const newDto = { ...createSubscriptionDto, latitude: 40.00, longitude: -0.50 }
            await expect(createSubscriptionUseCase.execute(newDto)).rejects.toThrow()
        })
    })


    describe("Create a second subscription for the same customer", () => {
        let secondCreateSubscriptionDto: CreateSubscriptionDto
        let secondSubscriptionResult
            : any

        beforeAll(async () => {
            secondCreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons3Recipes.id.toString(),
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

            secondSubscriptionResult = await createSubscriptionUseCase.execute(secondCreateSubscriptionDto)
        })

        describe("Orders validation", () => {
            it("Should create another 12 orders", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(secondSubscriptionResult.subscription.id)
                expect(orders.length).toBe(12)
            })

            it("Should bill the first order", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(secondSubscriptionResult.subscription.id)
                const firstOrder: Order = orders[0]
                expect(firstOrder.isBilled()).toBe(true)
            })

            it("Should be 24 orders for the customer", async () => {
                const orders = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
                expect(orders.length).toBe(24)
            })


        })

        describe("Payment Orders validation", () => {
            it("Should have 13 payment orders", async () => {
                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                expect(paymentOrders.length).toBe(13)
            })

            it("Should bill the first payment order", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(secondSubscriptionResult.subscription.id)
                const firstOrder: Order = orders.sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[0]
                const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(firstOrder.paymentOrderId!, Locale.es)
                expect(paymentOrder?.isBilled()).toBe(true)
                expect(paymentOrder)
            })


            // O tampoco debería sumar si tiene una Order Billed
            it("Should not sum the shipping cost to the first order of the second subscription if the next week it has an active order of the first subscription", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const firstPaymentOrderOfSecondSubscription: PaymentOrder = paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())[1]

                expect(firstPaymentOrderOfSecondSubscription.shippingCost).toBe(0)
            })

            it("Should not sum the shipping cost of the shipping zone to the rest of the existent payment orders", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                const firstPaymentOrderOfSecondSubscription: PaymentOrder = paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())[1]

                for (let paymentOrder of paymentOrders) {
                    if (paymentOrder.id.equals(firstPaymentOrderOfSecondSubscription.id)) continue
                    expect(paymentOrder.shippingCost).toBe(MOCK_SHIPPING_COST)
                }
            })

            it("Should sum the price of the second plan variant to the existent active payment orders", async () => {
                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
                for (let paymentOrder of paymentOrders) {
                    if (paymentOrder.isActive()) {
                        expect(paymentOrder.amount).toBe(planGourmetVariant2Persons2Recipes.getPaymentPrice() + planGourmetVariant2Persons3Recipes.getPaymentPrice())
                    }
                }
            })
        })
        afterAll(async () => {
            mockSubscriptionRepository.delete(secondSubscriptionResult.subscription.id)
            mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order) => order.subscriptionId !== secondSubscriptionResult.subscription.id)
            mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder) => paymentOrder.customerId !== CUSTOMER_ID)
        })

    })

    afterAll(async () => {
        mockSubscriptionRepository.delete(firstSubscriptionResult.subscription.id)
        mockOrderRepository.$orders = mockOrderRepository.$orders.filter((order) => order.subscriptionId !== firstSubscriptionResult.subscription.id)
        mockPaymentOrderRepository.$paymentOrders = mockPaymentOrderRepository.$paymentOrders.filter((paymentOrder) => paymentOrder.customerId !== CUSTOMER_ID)
    })

})

describe("Creating a subscription in different week days", () => {
    const CUSTOMER_FIRST_NAME = "Alejo"
    const CUSTOMER_LAST_NAME = "Scotti"
    const CUSTOMER_PHONE = "634135817"
    const CUSTOMER_ADDRESS_NAME = "Vicent Blasco Ibañez 5"
    const CUSTOMER_ADDRESS_DETAILS = "Bloque 7, Escalera 2, Puerta 9"
    const CUSTOMER_LATITUDE = 39.4869251
    const CUSTOMER_LONGITUDE = -0.3298131
    let createSubscriptionDto: CreateSubscriptionDto = {
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
        purchaseDate: new Date() // Change it before each test
    }
    let subscriptionResult: any


    describe("Creating a susbcription for a shipping zone with shipping day on Tuesday", () => {

        describe("Creating a susbcription on Monday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 6, 31) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Tuesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(8)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })

            it("Should assign the purchase date as the createdAt date for each Order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                orders.forEach((order) => {
                    expect(order.createdAt.getTime()).toBe(createSubscriptionDto.purchaseDate.getTime())
                })
            })

        })
        describe("Creating a susbcription on Tuesday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 1) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Tuesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(8)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })

        })
        describe("Creating a susbcription on Wednesday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 2) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })


            it("Should create the first order with shipping date on Tuesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(8)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Thursday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 3) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Tuesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(8)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Friday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 4) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Tuesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(8)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Saturday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 5) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Tuesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(8)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Sunday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 6) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Tuesday of the next week (Skipping one tuesday)", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(TUESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getDate()).toBe(15)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
    })

    describe("Creating a susbcription for a shipping zone with shipping day on Wednesday", () => {

        beforeAll(async () => {
            customerShippingZone.shippingDayOfWeek = WEDNESDAY
        })

        describe("Creating a susbcription on Monday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 6, 31) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Wednesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(WEDNESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(9)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })
        })

        describe("Creating a susbcription on Tuesday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 1) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Wednesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(WEDNESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(9)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })

        })

        describe("Creating a susbcription on Wednesday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 2) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Wednesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(WEDNESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(9)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Thursday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 3) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Wednesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(WEDNESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(9)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Friday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 4) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Wednesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(WEDNESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(9)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Saturday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 5) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Wednesday of the next week", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(WEDNESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(9)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })


        })
        describe("Creating a susbcription on Sunday", () => {
            beforeAll(async () => {
                createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: new Date(2023, 7, 6) }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            })

            it("Should create the first order with shipping date on Wednesday of the next week (Skips one Wednesday)", async () => {
                const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
                expect(orders[0].shippingDate.getDay()).toBe(WEDNESDAY.dayNumberOfWeek)
                expect(orders[0].shippingDate.getDate()).toBe(16)
                expect(orders[0].shippingDate.getMonth()).toBe(7)
                expect(orders[0].shippingDate.getFullYear()).toBe(2023)
            })

            it("Should assign a week that contains the shipping date to the first order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscriptionResult.subscription.id)
                expect(orders[0].week.minDay.getTime()).toBeLessThan(orders[0].shippingDate.getTime())
                expect(orders[0].week.maxDay.getTime()).toBeGreaterThan(orders[0].shippingDate.getTime())
            })

        })

        afterAll(async () => {
            customerShippingZone.shippingDayOfWeek = TUESDAY
        })
    })
})

describe("Creating a subscripion with the payment integration Failure (Stripe mocked)", () => {
    const CUSTOMER_ID = new CustomerId()
    let createSubscriptionUseCaseWithFailurePaymentService: CreateSubscription
    let createSubscriptionDto: CreateSubscriptionDto

    beforeAll(async () => {
        mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementationOnce(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => {
            return {
                client_secret: "client_secret",
                id: "id",
                status: "canceled"
            }
        }
        )
        createSubscriptionUseCaseWithFailurePaymentService = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
        const customer = Customer.create(
            "alejoscotti+stripe_failure@gmail.com",
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
    })

    it("Should throw an error if stripe rejects the payment", async () => {
        await expect(createSubscriptionUseCaseWithFailurePaymentService.execute(createSubscriptionDto)).rejects.toThrow()

    })

    it("Shouldn't create the subscription if stripe rejects the payment", async () => {
        const customerSubscriptions = await mockSubscriptionRepository.findByCustomerId(CUSTOMER_ID, Locale.es)
        expect(customerSubscriptions.length).toBe(0)
    })

    it("Shouldn't create any order if stripe rejects the payment", async () => {
        const orders = await mockOrderRepository.findAllByCustomersIds([CUSTOMER_ID], Locale.es)
        expect(orders.length).toBe(0)
    })
    it("Shouldn't create any payment order if stripe rejects the payment", async () => {
        const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
        expect(paymentOrders.length).toBe(0)
    })
    it("Shouldn't create the customer member get member code if stripe rejects the payment", async () => {
        const customer: Customer = await mockCustomerRepository.findByIdOrThrow(CUSTOMER_ID)
        expect(customer.friendCode).toBeUndefined()
    })
})

describe("Creating a subscripion with the 3D Secure", () => {
    const CUSTOMER_ID = new CustomerId()
    let createSubscriptionUseCaseWith3DSecurePaymentMethod: CreateSubscription
    let createSubscriptionDto: CreateSubscriptionDto
    let createSubscriptionResult: any

    beforeAll(async () => {
        mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementationOnce(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => {
            return {
                client_secret: "client_secret",
                id: "id",
                status: "requires_action"
            }
        }
        )
        createSubscriptionUseCaseWith3DSecurePaymentMethod = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
        const customer = Customer.create(
            "alejoscotti+requires_action@gmail.com",
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

        createSubscriptionResult = await createSubscriptionUseCaseWith3DSecurePaymentMethod.execute(createSubscriptionDto)
    })

    it("Should return a payment intent w status requires_action", async () => {
        expect(createSubscriptionResult.paymentIntent.status).toBe("requires_action")

    })

    it("Should create the first payment order in PAYMENT_ORDER_PENDING_CONFIRMATION state", async () => {
        const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)
        expect(paymentOrders[0].state.title).toBe("PAYMENT_ORDER_PENDING_CONFIRMATION")
    })

    it("Should leave the order related to the pending payemnt order in state ORDER_PENDING_PAYMENT", async () => {
        const orders: Order[] = (await mockOrderRepository.findAllBySubscriptionId(createSubscriptionResult.subscription.id)).sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())
        expect(orders[0].state.title).toBe("ORDER_PENDING_PAYMENT")
    })
})