import { User } from "../../../../bounded_contexts/IAM/domain/user/User";
import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";

export interface GetShippingRateDto {
    latitude: number;
    longitude: number;
    currentUser?: User | Customer;
    locale: Locale;
}
