import { Subscription } from "../../subscription/Subscription";
import { CouponId } from "../CouponId";
import { ILimitAplication } from "./ILimitAplication";

export class LimitQty implements ILimitAplication {
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        this.type = type;
        this.value = value;
    }

    public isValid(subscriptions: Subscription[], couponId: CouponId): boolean {
        const subscriptionWithTheCoupon: Subscription | undefined = subscriptions.find((sub) => sub.coupon?.id.equals(couponId));
        if (!subscriptionWithTheCoupon) return true;

        return subscriptionWithTheCoupon?.couponChargesQtyApplied < this.value;
    }
}
