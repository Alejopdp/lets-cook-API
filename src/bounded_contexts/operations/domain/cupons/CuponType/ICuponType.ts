export interface ICouponType {
    type: string,
    value: number,
    applyCoupon(totalPrice: number): number;
    getDiscountAmount(planVariantPrice: number, shippingCost?: number): number
}
