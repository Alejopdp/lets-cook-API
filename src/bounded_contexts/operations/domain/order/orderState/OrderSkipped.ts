import { Order } from "../Order";
import { IOrderState } from "./IOrderState";
import { OrderActive } from "./OrderActive";
import { OrderBilled } from "./OrderBilled";
import { OrderCancelled } from "./OrderCancelled";
import { OrderPendingPayment } from "./OrderPendingPayment";
import { OrderRejectedPayment } from "./OrderRejectedPayment";

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

    public toBilled(order: Order): void {
        return;
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
        return true;
    }

    public isCancelled(): boolean {
        return false;
    }

    public isBilled(): boolean {
        return false;
    }

    public isActive(): boolean {
        return false;
    }
}
