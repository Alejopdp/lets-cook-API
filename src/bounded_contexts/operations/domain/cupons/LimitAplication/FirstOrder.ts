import { Subscription } from "../../subscription/Subscription";
import { CouponId } from "../CouponId";
import { ILimitAplication } from "./ILimitAplication";

export class FirstOrder implements ILimitAplication {
    public type: string;
    public value: number;

    constructor(type: string, value: number) {
        this.type = type;
        this.value = 0;
    }

    public isValid(subscriptions: Subscription[]): boolean {
        if (!!subscriptions[0]) throw new Error("No puedes aplicar el cupón ingresado debido a que solo aplica para primeros pedidos");
        return true;
    }
}
