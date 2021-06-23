import { ISubscriptionState } from "./ISubscriptionState";

export class SubscriptionActive implements ISubscriptionState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "SUBSCRIPTION_ACTIVE";
        this.humanTitle = "Activa";
        this.color = "green";
    }
}
