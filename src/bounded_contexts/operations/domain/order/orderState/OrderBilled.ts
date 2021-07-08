import { Order } from "../Order";
import { IOrderState } from "./IOrderState";
import { OrderCancelled } from "./OrderCancelled";
import { OrderSkipped } from "./OrderSkipped";

export class OrderBilled implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_BILLED";
        this.humanTitle = "Orden pagada";
        this.color = "green";
    }

    public toCancelled(order: Order): void {
        order.state = new OrderCancelled();
    }

    public toActive(order: Order): void {
        order.state = new OrderBilled();
    }

    public toSkipped(order: Order): void {
        order.state = new OrderSkipped();
    }

    public toBilled(order: Order): void {
        order.state = new OrderBilled()
    }

    public isSkipped(): boolean {
        return false;
    }

    public isCancelled(): boolean {
        return false;
    }

    public isActive(): boolean {
        return true;
    }
}
