import { Locale } from "../../domain/locale/Locale";

export interface GetCustomerByIdDto {
    customerId: string | number;
    locale: Locale;
}
