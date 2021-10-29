import { Subscription } from "../../subscription/Subscription";
import { CouponId } from "../CouponId";
import { ILimitAplication } from "./ILimitAplication";

export class OnePerCustomer implements ILimitAplication {
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        this.type = type;
        this.value = 0;
    }

    public isValid(subscriptions: Subscription[], couponId: CouponId): boolean {
        if (subscriptions.some((sub) => !!sub.coupon && sub.coupon.id.equals(couponId))) {
            throw new Error("Ya has utilizado este cupón de descuento");
        }
        return true;
    }
}
