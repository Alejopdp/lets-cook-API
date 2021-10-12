import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetCustomerInformationAsAdminPresenter {
    public present({
        customer,
        subscriptions,
        paymentOrders,
        orders,
    }: {
        customer: Customer;
        subscriptions: Subscription[];
        paymentOrders: PaymentOrder[];
        orders: Order[];
    }): any {
        return {
            personalData: {
                id: customer.id.value.toString(),
                email: customer.email,
                ...customer.getPersonalInfo(),
                shippingAddress: customer.getShippingAddress(),
                billingData: customer.getBillingData(),
                paymentMethods: customer.paymentMethods.map((method) => ({
                    id: method.id.value,
                    card: method.getCardLabel(),
                    expirationDate: method.getExpirationDate(),
                    isDefault: method.isDefault,
                })),
            },
            subscriptions: this.presentSubscriptions(subscriptions),
            orders: this.presentOrders(
                orders
                    .filter((order) => order.shippingDate >= new Date() && (order.isActive() || order.isSkipped() || order.isBilled()))
                    .sort((order1, order2) => (order1.shippingDate > order2.shippingDate ? 1 : -1)),
                paymentOrders
            ),
            paymentOrders: this.presentPaymentOrders(
                paymentOrders.filter(
                    (paymentOrder) =>
                        paymentOrder.state.isBilled() ||
                        paymentOrder.state.title === "PAYMENT_ORDER_REFUNDED" ||
                        paymentOrder.state.title === "PAYMENT_ORDER_PARTIALLY_REFUNDED"
                ),
                orders
            ),
        };
    }

    public presentSubscriptions(subscriptions: Subscription[]): any {
        return subscriptions.map((subscription) => ({
            id: subscription.id.value,
            plan: subscription.plan.name,
            variant: subscription.getPlanVariantLabel(),
            price: subscription.getPriceByFrequencyLabel(),
            frequency: subscription.frequency.value(),
            status: subscription.state.title,
        }));
    }

    public presentOrders(orders: Order[], paymentOrders: PaymentOrder[]): any {
        const paymentOrderMap: { [key: string]: PaymentOrder } = {};
        for (let paymentOrder of paymentOrders) {
            paymentOrderMap[paymentOrder.id.value] = paymentOrder;
        }

        return orders.map((order) => ({
            id: order.id.value,
            date: order.getDdMmYyyyShipmentDate(),
            plan: order.plan.name,
            variation: order.getPlanVariantLabel(order.planVariantId),
            price: order.getTotalPrice(),
            active: order.isActive() || order.isBilled(),
            orderNumber: order.counter,
            isSkipped: order.isSkipped(),
            state: order.state.title,
            isSkippable: paymentOrderMap[order.paymentOrderId?.value || ""].state.isActive(),
        }));
    }

    public presentPaymentOrders(paymentOrders: PaymentOrder[], orders: Order[]): any {
        const paymentOrderOrderMap: { [key: string]: Order[] } = {};

        for (let order of orders) {
            const actualPaymentOrderId = order.paymentOrderId?.value;
            if (actualPaymentOrderId) {
                const actualKey = paymentOrderOrderMap[actualPaymentOrderId];

                paymentOrderOrderMap[actualPaymentOrderId] = Array.isArray(actualKey)
                    ? [...paymentOrderOrderMap[actualPaymentOrderId], order]
                    : [order];
            }
        }

        return paymentOrders.map((paymentOrder) => ({
            id: paymentOrder.id.value,
            date: paymentOrder.getDdMmYyyyBillingDate(),
            ordersQty: paymentOrderOrderMap[paymentOrder.id.value]?.length || "",
            price: paymentOrder.getTotalAmount(),
            status: paymentOrder.state.title,
        }));
    }
}
