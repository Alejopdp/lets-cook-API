import { IOrderState } from "./IOrdeState";

export class OrderSkipped implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_SKIPPED";
        this.humanTitle = "Saltada";
        this.color = "yellow";
    }
}
