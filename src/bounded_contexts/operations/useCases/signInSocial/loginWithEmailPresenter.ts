import { Customer } from "../../domain/customer/Customer";

export class LoginWithEmailPresenter {
    public static present(token: string, customer: Customer): any {
        return {
            userInfo: {
                email: customer.email,
                id: customer.id.value,
                shippingAddress: {
                    addressDetails: customer.shippingAddress?.details,
                    addressName: customer.shippingAddress?.name,
                    latitude: customer.shippingAddress?.latitude,
                    longitude: customer.shippingAddress?.longitude,
                },
                paymentMethods: customer.paymentMethods.map((method) => ({
                    id: method.id.value,
                    label: method.getCardLabel(),
                    isDefault: method.isDefault,
                })),
            },
            token,
        };
    }
}
