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

    public isValid(subscription: Subscription): boolean {
        return subscription.couponChargesAppliedQty < this.value;
    }
}
