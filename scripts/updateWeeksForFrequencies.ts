import { Locale } from "../src/bounded_contexts/operations/domain/locale/Locale"
import { mongooseOrderRepository } from "../src/bounded_contexts/operations/infra/repositories/order"
import { mongoosePaymentOrderReposiotry } from "../src/bounded_contexts/operations/infra/repositories/paymentOrder"
import { mongooseSubscriptionRepository } from "../src/bounded_contexts/operations/infra/repositories/subscription"
import { mongooseWeekRepository } from "../src/bounded_contexts/operations/infra/repositories/week"
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config"

async function execute() {
    process.env.NODE_ENV = "production"
    process.env.URLDB = "mongodb+srv://lets_cook_admin:Rwn7Bu2VJqju6Yia@ecommerce.6octe.mongodb.net/"
    await connectToDatabase()

    const subscriptions = await mongooseSubscriptionRepository.findBy({ frequency: ["biweekly", "monthly"] }, Locale.es)
    const orders = await mongooseOrderRepository.findBy({ subscription: subscriptions.map(sub => sub.id.toString()), shippingDate: { $gte: new Date() } }, Locale.es)
    console.log("*****************************")
    const weeks = await mongooseWeekRepository.findAll()
    const paymentOrders = await mongoosePaymentOrderReposiotry.findBy({ _id: orders.map(order => order.paymentOrderId?.toString()) })
    let counterOfWrongOrders = 0

    for (const order of orders) {
        if (!order.week.containsDate(order.shippingDate)) {

            counterOfWrongOrders++
            for (const week of weeks) {
                if (week.containsDate(order.shippingDate)) {
                    order.week = week

                    const relatedPaymentOrder = paymentOrders.find(po => po.id.toString() === order.paymentOrderId?.toString())!
                    relatedPaymentOrder.week = week
                }
            }
        }
    }


    await mongooseOrderRepository.updateMany(orders)
    await mongoosePaymentOrderReposiotry.updateMany(paymentOrders)
}

execute()