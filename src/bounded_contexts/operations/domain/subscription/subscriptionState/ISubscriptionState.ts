import { Subscription } from "../Subscription";

export interface ISubscriptionState {
    title: string;
    humanTitle: string;
    color: string;
    toCancelled(subscription: Subscription): void;
    toActive(subscription: Subscription): void;
    isCancelled(): boolean;
    isActive(): boolean;
}
