import { Order } from "../Order";
import { IOrderState } from "./IOrderState";
import { OrderActive } from "./OrderActive";
import { OrderBilled } from "./OrderBilled";
import { OrderCancelled } from "./OrderCancelled";
import { OrderPendingPayment } from "./OrderPendingPayment";
import { OrderSkipped } from "./OrderSkipped";

export class OrderRejectedPayment implements IOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "ORDER_REJECTED_PAYMENT";
        this.humanTitle = "Pago rechazado";
        this.color = "green";
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
        return true;
    }

    public isSkipped(): boolean {
        return false;
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
