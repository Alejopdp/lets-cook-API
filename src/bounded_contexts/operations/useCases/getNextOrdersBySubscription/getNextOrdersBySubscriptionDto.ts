import { Locale } from "../../domain/locale/Locale";

export interface GetNextOrdersBySubscriptionDto {
    subscriptionId: string | number;
    locale: Locale;
}
