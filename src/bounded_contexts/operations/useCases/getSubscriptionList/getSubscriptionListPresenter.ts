import { Subscription } from "../../domain/subscription/Subscription";

export class GetSubscriptionListPresenter {
    public present(subscriptions: Subscription[]): any {
        const presentedSubscriptions = [];

        for (let subscription of subscriptions) {
            console.log("Sub w error: ", subscription.id.value);
            presentedSubscriptions.push({
                id: subscription.id.value,
                customerName: subscription.customer.getPersonalInfo()?.fullName,
                customerEmail: subscription.customer.email,
                customerId: subscription.customer.id.value,
                plan: subscription.plan.name,
                planVariant: subscription.getPlanVariantLabel(),
                frequency: subscription.frequency.value(),
                amount: subscription.getPrice(),
                state: subscription.state.title,
            });
        }

        return presentedSubscriptions;
    }
}
