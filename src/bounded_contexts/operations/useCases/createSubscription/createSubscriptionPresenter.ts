import Stripe from "stripe";
import { Subscription } from "../../domain/subscription/Subscription";

export class CreateSubscriptionPresenter {
    public present(subscription: Subscription, paymentIntent: Stripe.PaymentIntent): any {
        return {
            subscriptionId: subscription.id.value,
            client_secret: paymentIntent.client_secret,
            payment_status: paymentIntent.status,
        };
    }
}
