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

const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository([])
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService()
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockLogRepository = new InMemoryLogRepository([])
const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)

const customerId = new CustomerId()
const customerPassword = UserPassword.create("Pass1234", false)
const customerEmail = "alejoscotti@gmail.com"
const customer = Customer.create(
    customerEmail,
    true,
    "",
    [],
    0,
    new Date(),
    undefined,
    undefined,
    customerPassword,
    "active",
    undefined,
    undefined,
    customerId
)
mockCustomerRepository.save(customer)
const gourmetPlanSku = new PlanSku("PlanGourmet")
const gourmetPlanSlug = new PlanSlug("plan-gourmet")
const planGourmetVariant2Persons2Recipes: PlanVariant = new PlanVariant(
    new PlanSku("GOUR1"),
    "",
    35.96,
    [],
    "",
    true,
    false,
    27.99,
    undefined,
    2,
    2
);
const planGourmetVariant2Persons3Recipes: PlanVariant = new PlanVariant(
    new PlanSku("GOUR2"),
    "",
    53.94,
    [],
    "",
    false,
    false,
    37.99,
    undefined,
    2,
    3
);
const gourmetPlanId = new PlanId()
const gourmetPlan = Plan.create("Plan Gourmet", "Plan Gourmet Description", gourmetPlanSku, "", true, PlanType.Principal, [planGourmetVariant2Persons2Recipes, planGourmetVariant2Persons3Recipes], [PlanFrequencyFactory.createPlanFrequency("weekly"), PlanFrequencyFactory.createPlanFrequency("biweekly")], true, [], Locale.es, gourmetPlanSlug, true, "", "", gourmetPlanId, true)
mockPlanRepository.save(gourmetPlan)

const valenciaPolygon = [
    [39.75, -0.78],  // Noroeste
    [39.75, -0.22],  // Noreste
    [38.98, -0.22],  // Sureste
    [38.98, -0.78]   // Suroeste
];
const customerShippingZoneRadio = new ShippingZoneRadio(valenciaPolygon.map((coordinates) => new Coordinates(coordinates[0], coordinates[1])))
const MOCK_SHIPPING_COST = 10
const SUNDAY = new Day(0)
const MONDAY = new Day(1)
const TUESDAY = new Day(2)
const WEDNESDAY = new Day(3)
const THURSDAY = new Day(4)
const FRIDAY = new Day(5)
const SATURDAY = new Day(6)
const customerShippingZone = ShippingZone.create("Valencia", "valencia", MOCK_SHIPPING_COST, "active", customerShippingZoneRadio, TUESDAY)
mockShippingZoneRepository.save(customerShippingZone)


describe("Create Subscription Use Case", () => {
    let createSubscriptionDto: any
    let firstSubscriptionResult: any
    const CUSTOMER_FIRST_NAME = "Alejo"
    const CUSTOMER_LAST_NAME = "Scotti"
    const CUSTOMER_PHONE = "634135817"
    const CUSTOMER_ADDRESS_NAME = "Vicent Blasco Ibañez 5"
    const CUSTOMER_ADDRESS_DETAILS = "Bloque 7, Escalera 2, Puerta 9"
    const CUSTOMER_LATITUDE = 39.4869251
    const CUSTOMER_LONGITUDE = -0.3298131

    beforeAll(async () => {

        createSubscriptionDto = {
            customerId: customerId.toString(),
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
            shippingCountry: "España"
        }
         

        firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
    })
    describe("It creates a new weekly subscription for a first-time customer", () => {


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

        })


        describe("Customer details validation", () => {
            it("Should update the customer name", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(customerId)
                expect(customer.getPersonalInfo().fullName).toBe(`${CUSTOMER_FIRST_NAME} ${CUSTOMER_LAST_NAME}`)
            })

            it("Should update the customer phone", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(customerId)
                expect(customer.getPersonalInfo().phone1).toBe(CUSTOMER_PHONE)
            })

            it("Should update the customer address", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(customerId)
                expect(customer.getShippingAddress().addressName).toBe(CUSTOMER_ADDRESS_NAME)
                expect(customer.getShippingAddress().addressDetails).toBe(CUSTOMER_ADDRESS_DETAILS)
            })

            it("Should update the customer latitude and longitude if changed", async () => {
                const customer: Customer = await mockCustomerRepository.findByIdOrThrow(customerId)
                expect(customer.getShippingAddress().latitude).toBe(CUSTOMER_LATITUDE)
                expect(customer.getShippingAddress().longitude).toBe(CUSTOMER_LONGITUDE)
            })

        })

        describe("Payment orders validation", () => {

            it("Should create 12 pamynet orders", async () => {
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
        let secondCreateSubscriptionDto: any
        let secondSubscriptionResult
            : any

        beforeAll(async () => {
            secondCreateSubscriptionDto = {
                customerId: customerId.toString(),
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
                shippingCountry: "España"
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
                const orders = await mockOrderRepository.findAllByCustomersIds([customerId], Locale.es)
                expect(orders.length).toBe(24)
            })

        })

        describe("Payment Orders validation", () => {
            it("Should have 13 payment orders", async () => {
                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(customerId)
                expect(paymentOrders.length).toBe(13)
            })

            it("Should bill the first payment order", async () => {
                const orders = await mockOrderRepository.findAllBySubscriptionId(secondSubscriptionResult.subscription.id)
                const firstOrder: Order = orders.sort((a, b) => a.shippingDate.getTime() - b.shippingDate.getTime())[0]
                const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findById(firstOrder.paymentOrderId!, Locale.es)
                expect(paymentOrder?.isBilled()).toBe(true)
                expect(paymentOrder)
            })

            // Ver el test que hay debajo. La primer PO de la 2da suscripción no tiene coste de envío porque se entrega la semana que viene y ya se le cobró o cobraría el sábado
            // it("Should not sum the shipping cost of the shipping zone to the existent payment orders", async () => {
            //     const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(customerId)
            //     for (let paymentOrder of paymentOrders) {
            //         expect(paymentOrder.shippingCost).toBe(MOCK_SHIPPING_COST)
            //     }
            // })

            it("Should not sum the shipping cost to the first order of the second subscription if the next week it has an active order of the first subscription", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(customerId)
                const firstPaymentOrderOfSecondSubscription: PaymentOrder = paymentOrders.sort((a, b) => a.billingDate.getTime() - b.billingDate.getTime())[1]
                const orderOfFirstPaymentOrder = (await mockOrderRepository.findByPaymentOrderId(firstPaymentOrderOfSecondSubscription.id, Locale.es))[0]
                const firstSubscritionOrders = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const orderOfFirstSubscriptionWithSameShippingDate: Order | undefined = firstSubscritionOrders.find((order) => order.shippingDate.getTime() === orderOfFirstPaymentOrder.shippingDate.getTime())

                if (orderOfFirstSubscriptionWithSameShippingDate?.isActive()) expect(firstPaymentOrderOfSecondSubscription.shippingCost).toBe(0)
            })


            it("Should sum the price of the second plan variant to the existent active payment orders", async () => {
                const paymentOrders = await mockPaymentOrderRepository.findByCustomerId(customerId)
                for (let paymentOrder of paymentOrders) {
                    if (paymentOrder.isActive()) {
                        expect(paymentOrder.amount).toBe(planGourmetVariant2Persons2Recipes.getPaymentPrice() + planGourmetVariant2Persons3Recipes.getPaymentPrice())
                    }
                }
            })
        })
    })

})

