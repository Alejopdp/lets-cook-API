export interface CreateSubscriptionDto {
    customerId: string | number;
    planId: string | number;
    planVariantId: string | number;
    planFrequency: string;
    restrictionComment: string;
    couponId?: string | number;
}
