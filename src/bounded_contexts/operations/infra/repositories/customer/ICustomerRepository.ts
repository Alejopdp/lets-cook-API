import { Locale } from "../../../domain/locale/Locale";
import { Customer } from "../../../domain/customer/Customer";
import { ShippingZoneId } from "../../../domain/shipping/ShippingZoneId";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";

export interface ICustomerRepository {
    save(customer: Customer | undefined): Promise<void>;
    isEmailVerified(email: string): Promise<boolean>;
    updateMany(customers: Customer[]): Promise<void>;
    findByEmail(email: string): Promise<Customer | undefined>;
    findBy(conditions: any): Promise<Customer[]>
    findById(id: CustomerId): Promise<Customer | undefined>;
    findByIdList(ids: CustomerId[]): Promise<Customer[]>;
    findByIdOrThrow(id: CustomerId): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    countActiveCustomersByWeek(week: Week): Promise<number>;
    countNewCustomersByWeek(week: Week): Promise<number>;
    countCustomersWithFriendCode(): Promise<number>;
    countNewLeadsByWeek(week: Week): Promise<number>;
    delete(customerId: CustomerId): void;
    findByName(name: string): Promise<Customer[]>;
}
