import Stripe from "stripe";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";

export class CreateSubscriptionPresenter {
    public present(subscription: Subscription, paymentIntent: Stripe.PaymentIntent, firstOrder: Order): any {
        return {
            subscriptionId: subscription.id.value,
            client_secret: paymentIntent.client_secret,
            payment_status: paymentIntent.status,
            firstOrderId: firstOrder.id.value,
        };
    }
}
