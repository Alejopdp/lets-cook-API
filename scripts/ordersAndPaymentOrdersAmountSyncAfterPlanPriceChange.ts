// npm exec ts-node scripts/ordersAndPaymentOrdersAmountSyncAfterPlanPriceChange.ts
import { Locale } from "../src/bounded_contexts/operations/domain/locale/Locale";
import { Order } from "../src/bounded_contexts/operations/domain/order/Order";
import { PaymentOrderCancelled } from "../src/bounded_contexts/operations/domain/paymentOrder/paymentOrderState/PaymentOrderCancelled";
import { mongooseOrderRepository } from "../src/bounded_contexts/operations/infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../src/bounded_contexts/operations/infra/repositories/paymentOrder";
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config";

const updatePrices = async () => {
    process.env.NODE_ENV = "production";
    process.env.URLDB = "mongodb+srv://lets_cook_admin:Rwn7Bu2VJqju6Yia@ecommerce.6octe.mongodb.net/";
    connectToDatabase();
    // Get skipped orders w billing Date gt tomorrow
    // Get related payment orders
    // Update orders price
    // Update payment orders amount taking into acccount the previous price
    const paymentOrderIdOrderMap = new Map<string, Order[]>();
    const allPaymentOrdersOrdersMap = new Map<string, Order[]>();
    const today = new Date();
    const skippedOrders = await mongooseOrderRepository.findBy({ state: "ORDER_SKIPPED", billingDate: { $gte: today } }, Locale.es);
    const paymentOrdersIds = skippedOrders.map((order) => order.paymentOrderId!);
    const allPaymentOrdersOrders = await mongooseOrderRepository.findByPaymentOrderIdList(paymentOrdersIds, Locale.es);
    const skippedOrdersRelatedPaymentOrders = await mongoosePaymentOrderReposiotry.findByIdList(paymentOrdersIds);

    console.log("Creating skippedOrdersRelatedPaymentOrders map");
    for (const order of skippedOrders) {
        if (!paymentOrderIdOrderMap.has(order.paymentOrderId?.toString() ?? "")) {
            paymentOrderIdOrderMap.set(order.paymentOrderId?.toString() ?? "", [order]);
        } else {
            paymentOrderIdOrderMap.set(order.paymentOrderId?.toString() ?? "", [
                ...(paymentOrderIdOrderMap.get(order.paymentOrderId?.toString() ?? "") ?? []),
                order,
            ]);
        }
    }
    console.log("Aux map created successfully :)");
    console.log("Creating allPaymentOrdersOrdersMap map");

    for (const order of allPaymentOrdersOrders) {
        if (!allPaymentOrdersOrdersMap.has(order.paymentOrderId?.toString() ?? "")) {
            allPaymentOrdersOrdersMap.set(order.paymentOrderId?.toString() ?? "", [order]);
        } else {
            allPaymentOrdersOrdersMap.set(order.paymentOrderId?.toString() ?? "", [
                ...(allPaymentOrdersOrdersMap.get(order.paymentOrderId?.toString() ?? "") ?? []),
                order,
            ]);
        }
    }

    console.log("Updating payment orders amount");
    var paymentOrdersToCancelQty = 0;
    for (const paymentOrder of skippedOrdersRelatedPaymentOrders) {
        const orders = allPaymentOrdersOrdersMap.get(paymentOrder.id.toString()) ?? [];
        const ordersPlanVariantSum = orders.reduce(
            (acc, order) => acc + (order.state.isActive() ? order.plan.getPlanVariantPrice(order.planVariantId) : 0),
            0
        );

        paymentOrder.amount = ordersPlanVariantSum;

        if (paymentOrder.amount === 0 && !paymentOrder.state.isCancelled()) {
            paymentOrder.state = new PaymentOrderCancelled();
            paymentOrdersToCancelQty++;
        }
    }

    console.log("Payment orders updataed successfully :)");
    console.log("Updating orders price");
    console.log("Orders updated successfully :)");
    console.log(`Order example: ${JSON.stringify(skippedOrders.find((o) => o.id.toString() === "856be045-5982-4a7c-9ea7-cef76462a120"))}`);
    console.log("====================================");
    console.log(
        `Payment order example ${JSON.stringify(
            skippedOrdersRelatedPaymentOrders.find((o) => o.id.toString() === "012887e2-93ce-46e1-bd31-39b3a90facf5")
        )}`
    );
    console.log("PAYMENT ORDERS TO CANCEL: ", paymentOrdersToCancelQty);

    await mongoosePaymentOrderReposiotry.updateMany(skippedOrdersRelatedPaymentOrders);
};

updatePrices();
