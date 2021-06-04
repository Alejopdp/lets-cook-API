import { ICouponType } from "./ICuponType";

export class PercentPrice implements ICouponType{
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        this.type = "percent";
        this.value = value;
    }
    
    applyCoupon(totalPrice: number): number {
        throw new Error("Method not implemented.");
    }
}