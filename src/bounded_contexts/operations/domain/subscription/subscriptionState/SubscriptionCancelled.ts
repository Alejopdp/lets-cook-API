import { ISubscriptionState } from "./ISubscriptionState";

export class SubscriptionCancelled implements ISubscriptionState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "SUBSCRIPTION_CANCELLED";
        this.humanTitle = "Cancelada";
        this.color = "red";
    }
}
