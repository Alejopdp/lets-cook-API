import { Customer } from "../../../domain/customer/Customer";
import { CustomerId } from "../../../domain/customer/CustomerId";

export interface ICustomerRepository {
    save(customer: Customer | undefined): Promise<void>;
    isEmailVerified(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<Customer | undefined>;
    findById(id: CustomerId): Promise<Customer | undefined>;
    findByIdList(ids: CustomerId[]): Promise<Customer[]>;
    findByIdOrThrow(id: CustomerId): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    delete(customerId: CustomerId): void;
    findByName(name: string): Promise<Customer[]>;
}
