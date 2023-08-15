export interface ApplyCouponToSubscriptionDto {
    subscriptionId: string;
    couponCode: string;
    customerId: string;
    queryDate: Date;
}
