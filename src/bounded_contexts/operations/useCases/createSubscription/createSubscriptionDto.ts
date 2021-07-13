export interface CreateSubscriptionDto {
    customerId: string | number;
    planId: string | number;
    planVariantId: string | number;
    planFrequency: string;
    restrictionComment: string;
    stripePaymentMethodId: string;
    couponId?: string | number;
    paymentMethodId: string;
}
