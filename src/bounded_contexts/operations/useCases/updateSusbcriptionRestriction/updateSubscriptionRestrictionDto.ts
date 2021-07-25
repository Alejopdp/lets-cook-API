import { Locale } from "../../domain/locale/Locale";

export interface UpdateSubscriptionRestrictionDto {
    subscriptionId: string;
    restrictionId: string;
    locale: Locale;
    comment: string;
}
