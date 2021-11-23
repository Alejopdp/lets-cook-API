import { PlanFrequency } from "../../plan/PlanFrequency";
import { Subscription } from "../Subscription";
import { ISubscriptionState } from "./ISubscriptionState";
import { SubscriptionActive } from "./SubscriptionActive";

export class SubscriptionCancelled implements ISubscriptionState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "SUBSCRIPTION_CANCELLED";
        this.humanTitle = "Cancelado";
        this.color = "red";
    }

    public getHumanTitle(frequency: PlanFrequency): string {
        return this.humanTitle;
    }

    public toCancelled(subscription: Subscription): void {
        subscription.state = new SubscriptionCancelled();
    }

    public toActive(subscription: Subscription): void {
        subscription.state = new SubscriptionActive();
    }

    public isCancelled(): boolean {
        return true;
    }

    public isActive(): boolean {
        return false;
    }
}
