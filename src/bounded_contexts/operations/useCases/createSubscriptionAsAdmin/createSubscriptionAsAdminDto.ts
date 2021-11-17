import { Locale } from "../../domain/locale/Locale";

export interface CreateSubscriptionAsAdminDto {
    customerId: string;
    planFrequency: string;
    planId: string;
    planVariantId: string;
    locale: Locale;
}
