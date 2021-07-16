import { Subscription } from "../../subscription/Subscription";

export interface ILimitAplication {
    type: string;
    value: number;
    isValid(subscription: Subscription): boolean;
}
