import { Order } from "../Order";
import { IOrderState } from "./IOrderState";
import { OrderCancelled } from "./OrderCancelled";
import { OrderPendingPayment } from "./OrderPendingPayment";
import { OrderRejectedPayment } from "./OrderRejectedPayment";
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
        order.state = new OrderBilled();
    }

    public toPaymentPending(order: Order): void {
        order.state = new OrderPendingPayment();
    }

    public toPaymentRejected(order: Order): void {
        order.state = new OrderRejectedPayment();
    }

    public isPendingPayment(): boolean {
        return false;
    }

    public isPaymentRejected(): boolean {
        return false;
    }

    public isSkipped(): boolean {
        return false;
    }

    public isCancelled(): boolean {
        return false;
    }

    public isBilled(): boolean {
        return true;
    }

    public isActive(): boolean {
        return false;
    }
}
