import { Locale } from "../../domain/locale/Locale";

export interface ChangeSubscriptionFrequencyDto {
    subscriptionId: string;
    frequency: "one_time" | "weekly" | "biweekly" | "monthly";
    locale: Locale;
    queryDate: Date;
}
