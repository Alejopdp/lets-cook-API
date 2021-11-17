import { User } from "../../../../bounded_contexts/IAM/domain/user/User";
import { Customer } from "../../domain/customer/Customer";

export interface Handle3dSecureFailureDto {
    subscriptionId: string;
    currentCustomer: Customer | User;
}
