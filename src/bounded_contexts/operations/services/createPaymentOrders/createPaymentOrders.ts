import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { CreatePaymentOrdersDto } from "./createPaymentOrdersDto";

export class CreatePaymentOrders {
    public execute(dto: CreatePaymentOrdersDto): PaymentOrder[] {
        const paymentOrders: PaymentOrder[] = [];
        const shippingDate: Date = new Date(); // TO DO: Es necesaria la shipping date en la payment order?

        for (let order of dto.orders) {
            var hasFreeShipping: boolean = order.hasFreeShipping;

            const newPaymentOrder = new PaymentOrder(
                shippingDate, // unnecessary
                new PaymentOrderActive(),
                "",
                order.billingDate,
                order.week,
                0,
                0,
                dto.shippingCost,
                dto.subscription.customer.id,
                hasFreeShipping
            );

            newPaymentOrder.addOrder(order);
            paymentOrders.push(newPaymentOrder);
        }

        return paymentOrders;
    }
}
