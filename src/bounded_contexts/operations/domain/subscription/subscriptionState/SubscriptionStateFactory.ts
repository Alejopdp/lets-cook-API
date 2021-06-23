import { ISubscriptionState } from "./ISubscriptionState";
import { SubscriptionActive } from "./SubscriptionActive";
import { SubscriptionCancelled } from "./SubscriptionCancelled";

export class SubscriptionStateFactory {
    public static createState(stateTitle: string): ISubscriptionState {
        switch (stateTitle) {
            case "SUBSCRIPTION_ACTIVE":
                return new SubscriptionActive();
            case "SUBSCRIPTION_CANCELLED":
                return new SubscriptionCancelled();
            default:
                throw new Error("Wrong subscription state");
        }
    }
}
