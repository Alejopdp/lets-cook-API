import { Locale } from "../../../domain/locale/Locale";
import { Customer } from "../../../domain/customer/Customer";
import { ShippingZoneId } from "../../../domain/shipping/ShippingZoneId";

export interface ICustomerRepository {
    save(cutomer: Customer | undefined): Promise<void>;
    isEmailVerified(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<Customer | undefined>;
}
