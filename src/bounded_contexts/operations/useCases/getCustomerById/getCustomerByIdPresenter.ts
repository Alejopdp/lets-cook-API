import { Customer } from "../../domain/customer/Customer";

export class GetCustomerByIdPresenter {
    public present(customer: Customer): any {
        return {
            id: customer.id.value.toString(),
            email: customer.email,
            personalData: customer.getPersonalInfo(),
            shippingAddress: customer.getShippingAddress(),
            billingData: customer.getBillingData(),
            paymentMethods: customer.paymentMethods.map((method) => ({
                id: method.id.value,
                card: method.getCardLabel(),
                expirationDate: method.getExpirationDate(),
                isDefault: method.isDefault,
            })),
        };
    }
}
