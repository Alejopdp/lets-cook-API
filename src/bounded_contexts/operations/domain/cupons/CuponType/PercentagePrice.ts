import { ICouponType } from "./ICuponType";

export class PercentPrice implements ICouponType {
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        if (value > 100 || value < 0) throw new Error("El porcentaje a descontar tiene que ser un número entre 0 y 100");
        this.type = "percent";
        this.value = value;
    }
    public getDiscountAmount(planVariantPrice: number): number {
        return (planVariantPrice * this.value) / 100;
    }

    applyCoupon(totalPrice: number): number {
        throw new Error("Method not implemented.");
    }
}
