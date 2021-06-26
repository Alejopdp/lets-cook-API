import { Order } from "../Order";
import { IOrderState } from "./IOrderState";

export class OrderCancelled implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_CANCELLED";
        this.humanTitle = "Cancelada";
        this.color = "red";
    }

    public toSkipped(order: Order): void {
        throw new Error("No puede saltear una semana cancelada");
    }

    public isSkipped(): boolean {
        return false;
    }
}
