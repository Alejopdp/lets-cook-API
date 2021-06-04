export interface ICouponType {
    type: string,
    value: number,
    applyCoupon(totalPrice: number) : number;
}
