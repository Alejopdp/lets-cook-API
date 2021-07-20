import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { CreatePaymentOrdersForDifferentFreqOrdersDto } from "./createPaymentOrdersForDifferentFreqOrdersDto";

export class CreatePaymentOrdersForDifferentFreqOrders {
    public execute(dto: CreatePaymentOrdersForDifferentFreqOrdersDto): PaymentOrder[] {
        const paymentOrders: PaymentOrder[] = [];
        const shippingDate: Date = new Date(); // TO DO: Es necesaria la shipping date en la payment order?
        const billingDateOrdersMap: { [date: string]: Order[] } = {};

        for (let order of dto.orders) {
            const actualKey = billingDateOrdersMap[order.billingDate.toString()];
            billingDateOrdersMap[order.billingDate.toString()] = Array.isArray(actualKey) ? [...actualKey, order] : [order];
        }

        const billingDateOrdersEntries = Object.entries(billingDateOrdersMap);

        for (let entry of billingDateOrdersEntries) {
            paymentOrders.push(
                new PaymentOrder(
                    shippingDate, // unnecessary
                    new PaymentOrderActive(),
                    "",
                    new Date(entry[0]),
                    entry[1][0].week,
                    entry[1].reduce((acc, order) => acc + order.price, 0),
                    0,
                    dto.shippingCost,
                    dto.customerId
                )
            );
        }

        return paymentOrders;
    }
}
