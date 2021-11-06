import { User } from "../../../../bounded_contexts/IAM/domain/user/User";
import { Customer } from "../../domain/customer/Customer";

export interface GetShippingRateDto {
    latitude: number;
    longitude: number;
    currentUser?: User | Customer;
}
