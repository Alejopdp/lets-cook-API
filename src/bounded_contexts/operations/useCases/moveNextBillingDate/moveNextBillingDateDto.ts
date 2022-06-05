import { Locale } from "../../domain/locale/Locale";

export interface MoveNextBillingDateDto {
    nextBillingDate: Date;
    subscriptionId: string;
    locale: Locale;
}
