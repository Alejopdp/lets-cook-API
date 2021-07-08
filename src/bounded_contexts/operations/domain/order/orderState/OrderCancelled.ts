import { Order } from "../Order";
import { IOrderState } from "./IOrderState";
import { OrderActive } from "./OrderActive";
import { OrderBilled } from "./OrderBilled";

export class OrderCancelled implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_CANCELLED";
        this.humanTitle = "Cancelada";
        this.color = "red";
    }

    public toCancelled(order: Order): void {
        order.state = new OrderCancelled();
    }

    public toActive(order: Order): void {
        throw new Error("No puede activar una orden cancelada");
    }

    public toSkipped(order: Order): void {
        throw new Error("No puede saltear una orden cancelada");
    }

    public toBilled(order: Order): void {
        order.state = new OrderBilled();
    }

    public isSkipped(): boolean {
        return false;
    }

    public isCancelled(): boolean {
        return true;
    }
    public isActive(): boolean {
        return false;
    }
}
