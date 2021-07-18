export interface GetCouponValidationDto {
    coupon: string;
    customerId: string;
    shippingCost: number;
    planId: string;
    planVariantId: string;
}
