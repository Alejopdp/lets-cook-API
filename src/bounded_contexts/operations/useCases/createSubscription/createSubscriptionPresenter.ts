import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { PaymentIntent } from "../../application/paymentService";

export class CreateSubscriptionPresenter {
    public present(
        subscription: Subscription,
        paymentIntent: PaymentIntent,
        firstOrder: Order,
        customerPaymentMethods: PaymentMethod[],
        amountBilled: number,
        tax: number,
        shippingCost: number,
        billedPaymentOrderHumanId: string | number,
        locale: Locale
    ): any {
        return {
            subscriptionId: subscription.id.value,
            client_secret: paymentIntent?.client_secret || "",
            payment_status: paymentIntent?.status || "",
            firstOrderId: firstOrder.id.value,
            firstOrderShippingDate: firstOrder.getHumanShippmentDay(locale),
            billedPaymentOrderHumanId,
            paymentOrderId: firstOrder.paymentOrderId?.value,
            customerPaymentMethods: customerPaymentMethods.map((pm) => ({
                id: pm.id.value,
                card: pm.getCardLabel(locale),
                expirationDate: pm.getExpirationDate(locale),
                isDefault: pm.isDefault,
            })),
            amountBilled,
        };
    }
}
