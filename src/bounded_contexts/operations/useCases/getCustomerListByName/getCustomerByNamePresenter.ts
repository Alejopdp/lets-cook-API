import { Customer } from "../../domain/customer/Customer";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";

export class GetCouponListPresenter {
    public static present(customers: Customer[]): any {
        const presentedCoupons = [];

        for (let customer of customers) {
            presentedCoupons.push({
                id: customer.id.value,
                email: customer.email,
                is_email_verified: customer.isEmailVerified,
                stripeId: customer.stripeId,
                state: customer.state,

                payment_methods: customer.paymentMethods.map((payment: PaymentMethod) => {
                    return {
                        id: payment.id.value,
                        brand: payment.brand,
                        last4Numbers: payment.last4Numbers,
                        exp_month: payment.exp_month,
                        exp_year: payment.exp_year,
                        cvc: payment.cvc,
                        stripeId: payment.stripeId,
                        isDefault: payment.isDefault,
                    };
                }),
                billingData: {
                    id: customer.billingAddress?.id.value,
                    latitude: customer.billingAddress?.latitude,
                    longitude: customer.billingAddress?.longitude,
                    address: customer.billingAddress?.addressName,
                    customerName: customer.billingAddress?.customerName,
                    details: customer.billingAddress?.details,
                    personalIdNumber: customer.billingAddress?.identification,
                },
                shippingData: {
                    id: customer.shippingAddress?.id.value,
                    latitude: customer.shippingAddress?.latitude,
                    longitude: customer.shippingAddress?.longitude,
                    address: customer.shippingAddress?.name,
                    details: customer.shippingAddress?.details,
                    preferredSchedule: customer.shippingAddress?.deliveryTime,
                },
                personalData: {
                    id: customer.personalInfo?.id.value,
                    name: customer.personalInfo?.name,
                    lastName: customer.personalInfo?.lastName,
                    phone1: customer.personalInfo?.phone1,
                    phone2: customer.personalInfo?.phone2,
                    birthDate: customer.personalInfo?.birthDate,
                    preferredLanguage: customer.personalInfo?.preferredLanguage,
                },
            });
        }

        return presentedCoupons;
    }
}
