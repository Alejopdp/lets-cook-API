import { Subscription } from "../../subscription/Subscription";
import { CouponId } from "../CouponId";
import { ILimitAplication } from "./ILimitAplication";

export class OnePerCustomer implements ILimitAplication {
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        this.type = type;
        this.value = value;
    }

    public isValid(subscriptions: Subscription[]): boolean {
        throw new Error("Ya has utilizado este cupón de descuento");
    }
}
