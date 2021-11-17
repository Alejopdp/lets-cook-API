import { User } from "./bounded_contexts/IAM/domain/user/User";
import { Customer } from "./bounded_contexts/operations/domain/customer/Customer";

declare namespace Express {
    export interface Request {
        decode?: Object;
        currentUser?: User | Customer;
    }
}
