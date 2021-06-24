import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Mapper } from "../../../../core/infra/Mapper";
export class CustomerMapper implements Mapper<Customer> {
    public toDomain(raw: any): Customer {
        return Customer.create(raw.email, raw.isEmailVerified, raw.password, raw.state, raw.codeToRecoverPassword, new CustomerId(raw._id));
    }
    public toPersistence(t: Customer): any {
        return {
            email: t.email,
            isEmailVerified: t.isEmailVerified,
            password: t.password ? t.password.value : undefined,
            state: t.state,
            codeToRecoverPassword: t.codeToRecoverPassword,
            _id: t.id.value,
        };
    }
}
