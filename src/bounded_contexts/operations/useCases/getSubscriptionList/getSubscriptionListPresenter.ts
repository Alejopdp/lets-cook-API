import { Locale } from "../../domain/locale/Locale";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetSubscriptionListPresenter {
    public present(subscriptions: Subscription[]): any {
        const presentedSubscriptions = [];

        for (let subscription of subscriptions) {
            presentedSubscriptions.push({
                id: subscription.id.value,
                customerName: subscription.customer.getPersonalInfo()?.fullName,
                customerEmail: subscription.customer.email,
                customerId: subscription.customer.id.value,
                plan: subscription.plan.name,
                planVariant: subscription.getPlanVariantLabel(Locale.es),
                frequency: subscription.frequency.value(),
                amount: subscription.getPrice(),
                state: subscription.state.title,
            });
        }

        return presentedSubscriptions;
    }
}
