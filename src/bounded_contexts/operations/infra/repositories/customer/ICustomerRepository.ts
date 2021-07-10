import { Locale } from "../../../domain/locale/Locale";
import { Customer } from "../../../domain/customer/Customer";
import { ShippingZoneId } from "../../../domain/shipping/ShippingZoneId";
import { CustomerId } from "../../../domain/customer/CustomerId";

export interface ICustomerRepository {
    save(cutomer: Customer | undefined): Promise<void>;
    isEmailVerified(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<Customer | undefined>;
    findById(id: CustomerId): Promise<Customer | undefined>;
    findByIdOrThrow(id: CustomerId): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    delete(customerId: CustomerId): void;
    findByName(name: string): Promise<Customer[]>;
}
