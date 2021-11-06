import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { Mapper } from "../../../../core/infra/Mapper";
import { addressMapper } from "..";
import { billingMapper } from "..";
import { personalInfoMapper } from "..";
import { Address } from "../../domain/address/Address";
import { Billing } from "../../domain/billing/Billing";
import { paymentMethodMapper } from ".";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { PersonalInfo } from "../../domain/customer/personalInfo/PersonalInfo";
import { UserPassword } from "../../../IAM/domain/user/UserPassword";
export class CustomerMapper implements Mapper<Customer> {
    public toDomain(raw: any): Customer {
        const shippingAddress: Address | undefined = raw.shippingAddress ? addressMapper.toDomain(raw.shippingAddress) : undefined;
        const billingAddress: Billing | undefined = raw.billingAddress ? billingMapper.toDomain(raw.billingAddress) : undefined;
        const paymentMethods: PaymentMethod[] = raw.paymentMethods.map((rawMethod: any) => paymentMethodMapper.toDomain(rawMethod));
        const personalInfo: PersonalInfo | undefined = raw.personalInfo ? personalInfoMapper.toDomain(raw.personalInfo) : undefined;

        return Customer.create(
            raw.email,
            raw.isEmailVerified,
            raw.stripeId,
            paymentMethods,
            raw.receivedOrdersQuantity || 0,
            shippingAddress,
            billingAddress,
            UserPassword.create(raw.password, true),
            raw.state,
            raw.codeToRecoverPassword,
            personalInfo,
            new CustomerId(raw._id),
            raw.friendCode || undefined
        );
    }
    public toPersistence(t: Customer): any {
        const dbPaymentMethods = t.paymentMethods.map((method) => paymentMethodMapper.toPersistence(method));

        return {
            email: t.email,
            isEmailVerified: t.isEmailVerified,
            stripeId: t.stripeId,
            password: t.password ? t.password.value : undefined,
            state: t.state,
            paymentMethods: dbPaymentMethods,
            codeToRecoverPassword: t.codeToRecoverPassword,
            receivedOrdersQuantity: t.receivedOrdersQuantity || 0,
            billingAddress: t.billingAddress ? billingMapper.toPersistence(t.billingAddress) : null,
            shippingAddress: t.shippingAddress ? addressMapper.toPersistence(t.shippingAddress) : null,
            personalInfo: t.personalInfo ? personalInfoMapper.toPersistence(t.personalInfo) : null,
            _id: t.id.value,
            friendCode: t.friendCode,
        };
    }
}
