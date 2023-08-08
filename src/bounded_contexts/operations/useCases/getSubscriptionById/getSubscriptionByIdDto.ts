import { Locale } from "../../domain/locale/Locale";

export interface GetSubscriptionByIdDto {
    subscriptionId: string | number;
    locale: Locale;
    queryDate: Date;
}
