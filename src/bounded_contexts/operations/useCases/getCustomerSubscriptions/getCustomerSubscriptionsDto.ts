import { Locale } from "../../domain/locale/Locale";

export interface GetCustomerSubscriptionsDto {
    customerId: string;
    locale: Locale;
}
