import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetCustomerInformationAsAdminPresenter {
    public present({
        customer,
        subscriptions,
        paymentOrders,
        orders,
        locale,
    }: {
        customer: Customer;
        subscriptions: Subscription[];
        paymentOrders: PaymentOrder[];
        orders: Order[];
        locale: Locale;
    }): any {
        return {
            friendCode: customer.friendCode,
            id: customer.id.value.toString(),
            email: customer.email,
            ...customer.getPersonalInfo(),
            shippingAddress: customer.getShippingAddress(),
            billingData: customer.getBillingData(),
            paymentMethods: customer.paymentMethods.map((method) => ({
                id: method.id.value,
                card: method.getCardLabel(locale),
                expirationDate: method.getExpirationDate(locale),
                isDefault: method.isDefault,
            })),
            wallet: customer.wallet ? {
                balance: customer.wallet.balance,
                amountToCharge: customer.wallet.amountToCharge,
                paymentMethodForCharging: customer.wallet.paymentMethodForCharging,
                last4Numbers: customer.paymentMethods.find(pm => pm.id.toString() === customer.wallet?.paymentMethodForCharging)?.last4Numbers ?? "",
                isEnabled: customer.wallet.isEnabled,
                datesOfCharge: customer.wallet.datesOfCharge.map(dateOfCharge => ({ dayNumber: dateOfCharge.day.dayNumberOfWeek, hour: dateOfCharge.hour, minute: dateOfCharge.minute })),
                walletMovementsLogs: customer.wallet.walletMovements.map((log: any) => ({
                    type: log.type,
                    title: log.title,
                    description: log.description,
                    createdAt: log.createdAt,
                })),
            } : undefined,

            subscriptions: this.presentSubscriptions(subscriptions, locale),
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

    public presentSubscriptions(subscriptions: Subscription[], locale: Locale): any {
        return subscriptions.map((subscription) => ({
            id: subscription.id.value,
            plan: subscription.plan.name,
            variant: subscription.getPlanVariantLabel(locale),
            price: subscription.getPriceByFrequencyLabel(locale),
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
            isSkippable: order.isActive(),
            isReanudable: order.isReanudable(),
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
            humanId: paymentOrder.getHumanIdOrIdValue(),
        }));
    }
}
