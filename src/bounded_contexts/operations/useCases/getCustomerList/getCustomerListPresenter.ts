import { Customer } from "../../domain/customer/Customer";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetCouponListPresenter {
    public static present(customers: Customer[], activeSubscriptions: Subscription[], oneTimeSubscriptionFutureOrders: Order[]): any {
        const customerActiveSubscriptionMap: { [customerId: string]: number } = {};
        const presentedCustomers = [];
        const subscriptionOrderMap = new Map<string, Order>();

        for (const order of oneTimeSubscriptionFutureOrders) {
            subscriptionOrderMap.set(order.subscriptionId.toString(), order);
        }

        for (let subscription of activeSubscriptions) {
            const actualKey = customerActiveSubscriptionMap[subscription.customer.id.value];
            const oneTimeOrder: Order | undefined = subscriptionOrderMap.get(subscription.id.toString());

            if (subscription.frequency.isOneTime() && !oneTimeOrder) continue;
            if (oneTimeOrder && subscription.isAOneTimeSubAndWasDelivered(oneTimeOrder)) continue;

            customerActiveSubscriptionMap[subscription.customer.id.value] = 1 + (actualKey ?? 0);
        }

        for (let customer of customers) {
            presentedCustomers.push({
                id: customer.id.value,
                email: customer.email,
                is_email_verified: customer.isEmailVerified,
                stripeId: customer.stripeId,
                state: customer.state,
                fullName: customer.personalInfo?.name ? `${customer.personalInfo.name} ${customer.personalInfo.lastName}` : "N/A",
                firstName: customer.personalInfo?.name || "N/A",
                lastName: customer.personalInfo?.lastName || "N/A",
                phone1: customer.personalInfo?.phone1 || "N/A",
                activeSubscriptions: customerActiveSubscriptionMap[customer.id.value],
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
                    addressName: customer.billingAddress?.addressName,
                    customerName: customer.billingAddress?.customerName,
                    addressDetails: customer.billingAddress?.details,
                    personalIdNumber: customer.billingAddress?.identification,
                },
                shippingData: {
                    id: customer.shippingAddress?.id.value,
                    latitude: customer.shippingAddress?.latitude,
                    longitude: customer.shippingAddress?.longitude,
                    addressName: customer.shippingAddress?.name,
                    addressDetails: customer.shippingAddress?.details,
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

        return presentedCustomers;
    }
}
