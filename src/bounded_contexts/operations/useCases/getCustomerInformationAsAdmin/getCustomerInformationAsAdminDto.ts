import { Locale } from "../../domain/locale/Locale";

export interface GetCustomerInformationAsAdminDto {
    customerId: string;
    locale: Locale;
}
