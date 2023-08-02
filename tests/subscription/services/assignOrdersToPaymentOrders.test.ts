import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer"
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale"
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order"
import { OrderActive } from "../../../src/bounded_contexts/operations/domain/order/orderState/OrderActive"
import { OrderBilled } from "../../../src/bounded_contexts/operations/domain/order/orderState/OrderBilled"
import { PaymentOrder } from "../../../src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder"
import { BiweeklyFrequency } from "../../../src/bounded_contexts/operations/domain/plan/PlanFrequency/BiweeklyFrequency"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { SubscriptionActive } from "../../../src/bounded_contexts/operations/domain/subscription/subscriptionState/SubscriptionActive"
import { InMemoryPaymentOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/paymentOrder/mockPaymentOrderRepository"
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository"
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository"
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders"
import { AssignOrdersToPaymentOrdersDto } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrdersDto"
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders"

const mockPlanRepository = new InMemoryPlanRepository()
const mockWeekRepository = new MockWeekRepository()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const createPaymentOrdersService = new CreatePaymentOrders()
const service = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)

describe("Assign orders to payment orders service", () => {
    let newCustomer: Customer

    beforeAll(async () => {
        const plan = (await mockPlanRepository.findAll())[0]
        const planVariant = plan.planVariants[0]
        newCustomer = Customer.create("alejoscotti@gmail.com", true, "asd", [], 0, new Date())
        const subscription = new Subscription(planVariant.id, plan, new BiweeklyFrequency(), new SubscriptionActive(), "", new Date(), newCustomer, planVariant.price)
        const orders: Order[] = []
        for (let i = 0; i < 12; i++) {
            const billingDate = new Date()
            billingDate.setDate(billingDate.getDate() + (i * 14))
            const shippingDate = new Date()
            shippingDate.setDate(shippingDate.getDate() + (i * 14) - 2)
            const weeks = await mockWeekRepository.findAll()

            const order = new Order(shippingDate, i === 0 ? new OrderBilled() : new OrderActive(), billingDate, weeks[0], planVariant.id, plan, planVariant.price, 0, true, subscription.id, [], [], false, newCustomer)
            orders.push(order)
        }


        const serviceDto: AssignOrdersToPaymentOrdersDto = {
            customerId: newCustomer.id,
            hasFreeShipping: true,
            orders,
            shippingCost: 0,
            subscription,
            weeks: []
        }
        const { newPaymentOrders, paymentOrdersToUpdate } = await service.execute(serviceDto)

        await mockPaymentOrderRepository.bulkSave(newPaymentOrders)

    })

    describe("When there are no payment orders for a customer", () => {
        it("Should create new 12 payment orders", async () => {
            const paymentOrders = await mockPaymentOrderRepository.findAll(Locale.es)
            expect(paymentOrders.length).toBe(12)
        })
    })

    // describe("When there are payment orders for a customer", () => {
    //     let newPaymentOrders: PaymentOrder[] = []
    //     let paymentOrdersToUpdate: PaymentOrder[] = []
    //     let orders: Order[] = []

    //     beforeAll(async () => {
    //         const plan = (await mockPlanRepository.findAll())[1]
    //         const planVariant = plan.planVariants[1]
    //         const subscription = new Subscription(planVariant.id, plan, new BiweeklyFrequency(), new SubscriptionActive(), "", new Date(), newCustomer, planVariant.price)

    //         for (let i = 0; i < 12; i++) {
    //             const billingDate = new Date()
    //             billingDate.setDate(billingDate.getDate() + (i * 14))
    //             const shippingDate = new Date()
    //             shippingDate.setDate(shippingDate.getDate() + (i * 14) - 2)
    //             const weeks = await mockWeekRepository.findAll()

    //             const order = new Order(shippingDate, i === 0 ? new OrderBilled() : new OrderActive(), billingDate, weeks[0], planVariant.id, plan, planVariant.price, 0, true, subscription.id, [], [], false, newCustomer)
    //             orders.push(order)
    //         }


    //         const serviceDto: AssignOrdersToPaymentOrdersDto = {
    //             customerId: newCustomer.id,
    //             hasFreeShipping: true,
    //             orders,
    //             shippingCost: 0,
    //             subscription,
    //             weeks: []
    //         }
    //         const result = await service.execute(serviceDto)
    //         newPaymentOrders = result.newPaymentOrders
    //         paymentOrdersToUpdate = result.paymentOrdersToUpdate

    //     })

    //     it("Repository Should find 11 payment orders", async () => {
    //         const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findActiveByCustomerAndBillingDateList(
    //             orders.map((order) => order.billingDate),
    //             newCustomer.id
    //         );
    //         const allPaymentOrders = await mockPaymentOrderRepository.findAll(Locale.es)
    //         expect(allPaymentOrders.length).toBe(12)
    //         expect(paymentOrders.length).toBe(11)
    //     })

    //     it("Should only create 1 new payment order", async () => {
    //         expect(newPaymentOrders.length).toBe(1)
    //     })

    // })
})