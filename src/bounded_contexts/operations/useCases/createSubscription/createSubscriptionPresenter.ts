import Stripe from "stripe";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";

export class CreateSubscriptionPresenter {
    public present(
        subscription: Subscription,
        paymentIntent: Stripe.PaymentIntent,
        firstOrder: Order,
        customerPaymentMethods: PaymentMethod[]
    ): any {
        return {
            subscriptionId: subscription.id.value,
            client_secret: paymentIntent.client_secret,
            payment_status: paymentIntent.status,
            firstOrderId: firstOrder.id.value,
            firstOrderShippingDate: firstOrder.getHumanShippmentDay(),
            customerPaymentMethods: customerPaymentMethods.map((pm) => ({
                id: pm.id.value,
                card: pm.getCardLabel(),
                expirationDate: pm.getExpirationDate(),
                isDefault: pm.isDefault,
            })),
        };
    }
}
