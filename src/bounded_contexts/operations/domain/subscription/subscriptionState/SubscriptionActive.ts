import { Locale } from "../../locale/Locale";
import { PlanFrequency } from "../../plan/PlanFrequency";
import { Subscription } from "../Subscription";
import { ISubscriptionState } from "./ISubscriptionState";
import { SubscriptionCancelled } from "./SubscriptionCancelled";

export class SubscriptionActive implements ISubscriptionState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "SUBSCRIPTION_ACTIVE";
        this.humanTitle = "Activo";
        this.color = "green";
    }
    public getHumanTitle(locale: Locale): string {
        const map: { [localeKey: string]: string } = {
            es: "Activo",
            en: "Active",
            ca: "Actiu",
        };

        return map[locale];
    }

    // public getHumanTitle(frequency: PlanFrequency, subscriptionCreationDate: Date, ): string {
    //     return frequency === PlanFrequency.PorUnicaVez ? "Entregada" : this.humanTitle;
    // }

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
