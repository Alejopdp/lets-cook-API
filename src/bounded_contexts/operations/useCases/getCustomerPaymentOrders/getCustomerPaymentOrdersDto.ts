import { Locale } from "../../domain/locale/Locale";

export interface GetCustomerPaymentOrdersDto {
    customerId: string | number;
    locale: Locale;
}
