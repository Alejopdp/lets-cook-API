import { Locale } from "../../domain/locale/Locale";

export interface GetSubscriptionByIdAsAdminDto {
    subscriptionId: string | number;
    locale: Locale;
}
