import { Subscription } from "../../subscription/Subscription";
import { CouponId } from "../CouponId";

export interface ILimitAplication {
    type: string;
    value: number;
    isValid(subscriptions: Subscription[], couponId: CouponId): boolean;
}
