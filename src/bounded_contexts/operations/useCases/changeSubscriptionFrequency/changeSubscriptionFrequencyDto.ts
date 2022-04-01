import { Locale } from "../../domain/locale/Locale";
import { IPlanFrequency } from "../../domain/plan/PlanFrequency/IPlanFrequency";

export interface ChangeSubscriptionFrequencyDto {
    subscriptionId: string;
    frequency: "one_time" | "weekly" | "biweekly" | "monthly";
    locale: Locale;
}
