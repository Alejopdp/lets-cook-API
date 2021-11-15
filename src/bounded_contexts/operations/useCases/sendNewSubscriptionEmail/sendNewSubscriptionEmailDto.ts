import { Locale } from "../../domain/locale/Locale";

export interface SendNewSubscriptionEmailDto {
    subscriptionId: string;
    locale: Locale;
}
