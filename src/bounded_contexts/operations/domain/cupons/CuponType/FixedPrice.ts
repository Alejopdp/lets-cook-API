import { ICouponType } from "./ICuponType";

export class FixedPrice implements ICouponType {
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        if (value < 0) throw new Error("El importe fijo a descontar tiene que ser un número positivo");
        this.type = "fixed";
        this.value = value;
    }

    applyCoupon(totalPrice: number): number {
        throw new Error("Method not implemented.");
    }
}
