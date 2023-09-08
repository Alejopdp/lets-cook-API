jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import moment from "moment"
import { CreateSubscriptionAsAdmin } from "../../../src/bounded_contexts/operations/useCases/createSubscriptionAsAdmin/createSubscriptionAsAdmin"
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
import { CreateSubscriptionAsAdminDto } from "../../../src/bounded_contexts/operations/useCases/createSubscriptionAsAdmin/createSubscriptionAsAdminDto"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { gourmetPlan, gourmetPlanSku, planGourmetVariant2Persons2Recipes, planGourmetVariant2Persons3Recipes } from "../../mocks/plan"
import { TUESDAY, WEDNESDAY } from "../../mocks/days"
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod"
import { WalletMovementLogType } from "../../../src/bounded_contexts/operations/domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum"

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
const createSubscriptionAsAdminUseCase = new CreateSubscriptionAsAdmin(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockCouponRepository, mockCreateFriendCodeService)

mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => ({
    client_secret: "client_secret",
    id: "id",
    status: "succeeded",
    amount: 0
}))

//@ts-ignore
mockPaymentService.paymentIntent.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<PaymentIntent> => await ({
    status: "succeeded",
    client_secret: "client_secret",
    id: "id",
    amount: 0
}))


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
const customerPaymentMethod = new PaymentMethod("visa", "4344", 8, 2030, "456", true, "stripe_id")
customer.addPaymentMethod(customerPaymentMethod)
customer.changeShippingAddress(
    CUSTOMER_LATITUDE,
    CUSTOMER_LONGITUDE,
    CUSTOMER_ADDRESS_NAME,
    CUSTOMER_ADDRESS_NAME,
    CUSTOMER_ADDRESS_DETAILS,
    "Valencia",
    "Valencia",
    "España",
    "46120"
);
customer.changeBillingAddress(
    CUSTOMER_LATITUDE,
    CUSTOMER_LONGITUDE,
    CUSTOMER_ADDRESS_NAME,
    "Alejo Scotti",
    CUSTOMER_ADDRESS_DETAILS,
    "",
    "Valencia",
    "Valencia",
    "España",
    "46120"
);
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


describe("Create subscription as admin use case", () => {
    let createSubscriptionDto: CreateSubscriptionAsAdminDto
    let firstSubscriptionResult: any

    beforeAll(async () => {

        createSubscriptionDto = {
            customerId: CUSTOMER_ID.toString(),
            planId: gourmetPlan.id.toString(),
            planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
            planFrequency: "weekly",
            locale: Locale.es,
            purchaseDate: new Date(),
            useWalletAsPaymentMethod: false,
            couponCode: ""
        }


        firstSubscriptionResult = await createSubscriptionAsAdminUseCase.execute(createSubscriptionDto)
    })

    describe("It creates a new weekly subscription for a first-time customer", () => {

        describe("Subscription validation", () => {
            it("Should create the subscription with the created date as the purchase date", async () => {
                const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                expect(subscription.createdAt.getDay()).toEqual(createSubscriptionDto.purchaseDate.getDay())
                expect(subscription.createdAt.getMonth()).toEqual(createSubscriptionDto.purchaseDate.getMonth())
                expect(subscription.createdAt.getFullYear()).toEqual(createSubscriptionDto.purchaseDate.getFullYear())
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
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id);
                orders.forEach((order, index) => {
                    const previousOrder = orders[index - 1];
                    if (previousOrder) {
                        const orderDate = new Date(order.shippingDate);
                        const previousOrderDate = new Date(previousOrder.shippingDate);

                        // Suma 7 días a la fecha anterior
                        previousOrderDate.setDate(previousOrderDate.getDate() + 7);

                        // Compara solo los días, meses y años
                        expect(orderDate.getFullYear()).toBe(previousOrderDate.getFullYear());
                        expect(orderDate.getMonth()).toBe(previousOrderDate.getMonth());
                        expect(orderDate.getDate()).toBe(previousOrderDate.getDate());
                    }
                });
            });


            it("Should create a payment order for each order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach((order) => {
                    expect(order.paymentOrderId).toBeDefined()
                })
            })

            it("Should create a shipping date after the billing date of each payment order", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                orders.forEach(async (order) => {
                    const paymentOrder: PaymentOrder | undefined = await mockPaymentOrderRepository.findByIdOrThrow(order.paymentOrderId!)
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
                        const difference = moment(paymentOrder.billingDate).diff(moment(previousPaymentOrder.billingDate), 'days')
                        expect(difference).toBe(7)
                    }

                })
            })
        })

        it("Should throw an error if the plan variant is not found", async () => {
            const wrongPlanVariantId = "wrongPlanVariantId"
            const newDto: CreateSubscriptionAsAdminDto = { ...createSubscriptionDto, planVariantId: wrongPlanVariantId }
            await expect(createSubscriptionAsAdminUseCase.execute(newDto)).rejects.toThrow()
        })

        it("Should throw an error if the customer is not within any shipping zone", async () => {
            customer.changeShippingAddress(40.00, -0.50, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_DETAILS, "Valencia", "Valencia", "España", "46120")
            await expect(createSubscriptionAsAdminUseCase.execute(createSubscriptionDto)).rejects.toThrow()
        })

        afterAll(async () => {
            customer.changeShippingAddress(CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_DETAILS, "Valencia", "Valencia", "España", "46120")
        })
    })

    describe("Given a customer with a charged wallet", () => {
        const CUSTOMER_ID = new CustomerId()
        const GOOD_DATES_OF_CHARGE = [{ dayNumber: 1, hour: "13", minute: "45" }, { dayNumber: 3, hour: "17", minute: "30" }]
        const PURCHASE_DATE = new Date(2023, 7, 24, 15)
        let customerPaymentMethod: PaymentMethod;
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

            customerPaymentMethod = new PaymentMethod("visa", "4344", 8, 2030, "456", true, "stripe_id")
            customer.changeShippingAddress(CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_DETAILS, "Valencia", "Valencia", "España", "46120")
            customer.changeBillingAddress(CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_ADDRESS_NAME, "Alejo Scotti", CUSTOMER_ADDRESS_DETAILS, "", "Valencia", "Valencia", "España", "46120")
            customer.addPaymentMethod(customerPaymentMethod)
            await mockCustomerRepository.save(customer)

            const createWalletUseCase = new CreateWallet(mockCustomerRepository)
            const chargeMoneyToWalletUseCase = new ChargeMoneyToWallet(mockPaymentService)

            await createWalletUseCase.execute({ customerId: customer.id.toString(), amountToCharge: 100, datesOfCharge: GOOD_DATES_OF_CHARGE, paymentMethodForCharging: customerPaymentMethod.id.toString() })
            await chargeMoneyToWalletUseCase.execute({ customer, amountToCharge: 100 })
        })

        describe("When it buys a subscription using the wallet having enough money", () => {
            let firstSubscriptionResult: any
            let newDto: CreateSubscriptionAsAdminDto

            beforeAll(async () => {

                newDto = { customerId: CUSTOMER_ID.toString(), locale: Locale.es, planFrequency: "weekly", useWalletAsPaymentMethod: true, couponCode: "", planId: gourmetPlan.id.toString(), planVariantId: planGourmetVariant2Persons2Recipes.id.toString(), purchaseDate: PURCHASE_DATE }

                firstSubscriptionResult = await createSubscriptionAsAdminUseCase.execute(newDto)
            })

            describe("Subscription validation", () => {
                it("Should create the subscription with the created date as the purchase date", async () => {
                    const subscription: Subscription = await mockSubscriptionRepository.findByIdOrThrow(firstSubscriptionResult.subscription.id, Locale.es)
                    expect(subscription.createdAt.getDay()).toEqual(newDto.purchaseDate.getDay())
                    expect(subscription.createdAt.getMonth()).toEqual(newDto.purchaseDate.getMonth())
                    expect(subscription.createdAt.getFullYear()).toEqual(newDto.purchaseDate.getFullYear())
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
                    const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id);
                    orders.forEach((order, index) => {
                        const previousOrder = orders[index - 1];
                        if (previousOrder) {
                            const orderDate = new Date(order.shippingDate);
                            const previousOrderDate = new Date(previousOrder.shippingDate);

                            // Suma 7 días a la fecha anterior
                            previousOrderDate.setDate(previousOrderDate.getDate() + 7);

                            // Compara solo los días, meses y años
                            expect(orderDate.getFullYear()).toBe(previousOrderDate.getFullYear());
                            expect(orderDate.getMonth()).toBe(previousOrderDate.getMonth());
                            expect(orderDate.getDate()).toBe(previousOrderDate.getDate());
                        }
                    });
                });


                it("Should create a payment order for each order", async () => {
                    const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                    orders.forEach((order) => {
                        expect(order.paymentOrderId).toBeDefined()
                    })
                })

                it("Should create a shipping date after the billing date of each payment order", async () => {
                    const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                    orders.forEach(async (order) => {
                        try {
                            const paymentOrder: PaymentOrder = await mockPaymentOrderRepository.findByIdOrThrow(order.paymentOrderId!)
                            expect(order.shippingDate.getTime()).toBeGreaterThan(paymentOrder!.billingDate.getTime())

                        } catch (error) {
                            console.log("Es aca 2: ", error);

                        }
                    })
                })

                it("Should relate a week to each order", async () => {
                    const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                    orders.forEach((order) => {
                        expect(order.week).toBeDefined()
                    })
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
                            const difference = moment(paymentOrder.billingDate).diff(moment(previousPaymentOrder.billingDate), 'days')
                            expect(difference).toBe(7)
                        }

                    })
                })
            })

            it("Should rest the amount of the plan variant to the wallet", async () => {
                expect(customer.wallet?.balance).toBe(62.01)
            })

            it("Should create a wallet movement", async () => {
                expect(customer.wallet?.walletMovements.filter(log => log.type === WalletMovementLogType.PURCHASE_PLAN_WITH_WALLET).length).toBe(1)
            })

            it("Should throw an error if the plan variant is not found", async () => {
                const wrongPlanVariantId = "wrongPlanVariantId"
                const newDto: CreateSubscriptionAsAdminDto = {
                    ...createSubscriptionDto, planVariantId: wrongPlanVariantId, customerId: CUSTOMER_ID.toString(), useWalletAsPaymentMethod: true
                }
                await expect(createSubscriptionAsAdminUseCase.execute(newDto)).rejects.toThrow()
            })

            it("Should throw an error if the customer is not within any shipping zone", async () => {
                customer.changeShippingAddress(40.00, -0.50, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_DETAILS, "Valencia", "Valencia", "España", "46120")
                await expect(createSubscriptionAsAdminUseCase.execute({ ...createSubscriptionDto, customerId: CUSTOMER_ID.toString(), useWalletAsPaymentMethod: true })).rejects.toThrow()
            })

            afterAll(async () => {
                customer.changeShippingAddress(CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_NAME, CUSTOMER_ADDRESS_DETAILS, "Valencia", "Valencia", "España", "46120")
            })

        })

        describe("When it buys a subscription using the wallet having not enough money", () => {

            beforeAll(async () => {
                if (customer.wallet) customer.wallet.balance = 0
            })

            it("Should throw an error if the customer has not enough money in the wallet", async () => {
                await expect(createSubscriptionAsAdminUseCase.execute({ ...createSubscriptionDto, customerId: CUSTOMER_ID.toString(), useWalletAsPaymentMethod: true })).rejects.toThrow()
            })

        })
    })
})