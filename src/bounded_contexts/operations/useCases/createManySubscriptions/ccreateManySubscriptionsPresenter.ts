import Stripe from "stripe";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";

export class CreateManySubscriptionsPresenter {
    public present(subscriptions: Subscription[], paymentIntent: Stripe.PaymentIntent, paymentOrder: PaymentOrder): any {
        console.log("Subscriptions: ", subscriptions);
        return {
            subscriptionsIds: subscriptions.map((sub) => sub.id.value),
            client_secret: paymentIntent.client_secret,
            payment_status: paymentIntent.status,
            paymentOrderId: paymentOrder.id.value,
        };
    }
}
