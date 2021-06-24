import { IOrderState } from "./IOrdeState";

export class OrderCancelled implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_CANCELLED";
        this.humanTitle = "Cancelada";
        this.color = "red";
    }
}
