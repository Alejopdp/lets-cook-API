import { ICouponType } from "./ICuponType";

export class FreeShipping implements ICouponType {
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        this.type = "free";
        this.value = 0;
    }

    applyCoupon(totalPrice: number): number {
        throw new Error("Method not implemented.");
    }
}
