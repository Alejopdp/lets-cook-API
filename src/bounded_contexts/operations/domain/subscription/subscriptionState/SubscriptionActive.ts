import { Subscription } from "../Subscription";
import { ISubscriptionState } from "./ISubscriptionState";
import { SubscriptionCancelled } from "./SubscriptionCancelled";

export class SubscriptionActive implements ISubscriptionState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "SUBSCRIPTION_ACTIVE";
        this.humanTitle = "Activa";
        this.color = "green";
    }

    public toCancelled(subscription: Subscription): void {
        subscription.state = new SubscriptionCancelled();
    }

    public toActive(subscription: Subscription): void {
        subscription.state = new SubscriptionActive();
    }

    public isCancelled(): boolean {
        return false;
    }

    public isActive(): boolean {
        return true;
    }
}
