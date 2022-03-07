import { Locale } from "../../domain/locale/Locale";

export interface SendUpdateEmailEmailDto {
    customerId: string;
    newEmail: string;
    locale: Locale;
}
