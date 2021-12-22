import { Locale } from "../../locale/Locale";
import { PlanFrequency } from "../../plan/PlanFrequency";
import { Subscription } from "../Subscription";

export interface ISubscriptionState {
    title: string;
    humanTitle: string;
    color: string;
    getHumanTitle(locale: Locale): string;
    toCancelled(subscription: Subscription): void;
    toActive(subscription: Subscription): void;
    isCancelled(): boolean;
    isActive(): boolean;
    // getHumanTitle(frequency: PlanFrequency, subscriptionCreationDate: Date, firstShippingDate: Date): string;
}
