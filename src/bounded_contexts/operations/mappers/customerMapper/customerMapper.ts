import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Mapper } from "../../../../core/infra/Mapper";
import { addressMapper } from "..";
import { Address } from "../../domain/address/Address";
export class CustomerMapper implements Mapper<Customer> {
    public toDomain(raw: any): Customer {
        const shippingAddress: Address | undefined = raw.shippingAddress ? addressMapper.toDomain(raw.shippingAddress) : undefined;
        const billingAddress: Address | undefined = raw.billingAddress ? addressMapper.toDomain(raw.billingAddress) : undefined;

        return Customer.create(
            raw.email,
            raw.isEmailVerified,
            shippingAddress,
            billingAddress,
            raw.password,
            raw.state,
            raw.codeToRecoverPassword,
            new CustomerId(raw._id)
        );
    }
    public toPersistence(t: Customer): any {
        return {
            email: t.email,
            isEmailVerified: t.isEmailVerified,
            password: t.password ? t.password.value : undefined,
            state: t.state,
            codeToRecoverPassword: t.codeToRecoverPassword,
            billingAddress: t.billingAddress ? addressMapper.toPersistence(t.billingAddress) : null,
            shippingAddress: t.shippingAddress ? addressMapper.toPersistence(t.shippingAddress) : null,
            _id: t.id.value,
        };
    }
}
