import { Order } from "../Order";
import { IOrderState } from "./IOrderState";

export class OrderSkipped implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_SKIPPED";
        this.humanTitle = "Saltada";
        this.color = "yellow";
    }

    public toSkipped(order: Order): void {
        throw new Error("La orden ya se encuentra saltada");
    }
    public isSkipped(): boolean {
        return true;
    }
}
