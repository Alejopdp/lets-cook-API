import { Order } from "../Order";
import { IOrderState } from "./IOrderState";
import { OrderSkipped } from "./OrderSkipped";

export class OrderActive implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_ACTIVE";
        this.humanTitle = "Activa";
        this.color = "green";
    }

    public toSkipped(order: Order): void {
        order.state = new OrderSkipped();
    }

    public isSkipped(): boolean {
        return false;
    }
}
