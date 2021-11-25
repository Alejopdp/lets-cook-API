import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";

export class GetCustomerByIdPresenter {
    public present(customer: Customer, locale: Locale): any {
        return {
            id: customer.id.value.toString(),
            email: customer.email,
            personalData: customer.getPersonalInfo(),
            shippingAddress: customer.getShippingAddress(),
            billingData: customer.getBillingData(),
            paymentMethods: customer.paymentMethods.map((method) => ({
                id: method.id.value,
                card: method.getCardLabel(locale),
                expirationDate: method.getExpirationDate(locale),
                isDefault: method.isDefault,
            })),
        };
    }
}
