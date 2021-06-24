import { IOrderState } from "./IOrdeState";

export class OrderActive implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_ACTIVE";
        this.humanTitle = "Activa";
        this.color = "green";
    }
}
