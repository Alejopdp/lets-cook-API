import { Order } from "../Order";
import { IOrderState } from "./IOrderState";
import { OrderActive } from "./OrderActive";
import { OrderCancelled } from "./OrderCancelled";

export class OrderSkipped implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_SKIPPED";
        this.humanTitle = "Saltada";
        this.color = "yellow";
    }

    public toCancelled(order: Order): void {
        order.state = new OrderCancelled();
    }

    public toActive(order: Order): void {
        order.state = new OrderActive();
    }

    public toSkipped(order: Order): void {
        order.state = new OrderSkipped();
    }

    public isSkipped(): boolean {
        return true;
    }

    public isCancelled(): boolean {
        return false;
    }
    public isActive(): boolean {
        return false;
    }
}
