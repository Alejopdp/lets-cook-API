import { PaymentOrder } from "../PaymentOrder";
import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderActive } from "./PaymentOrderActive";
import { PaymentOrderBilled } from "./PaymentOrderBilled";
import { PaymentOrderCancelled } from "./PaymentOrderCancelled";
import { PaymentOrderPendingConfirmation } from "./PaymentOrderPendingConfirmation";

export class PaymentOrderRejected implements IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_REJECTED";
        this.humanTitle = "Pago rechazado";
        this.color = "red";
    }

    public toPendingConfirmation(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderPendingConfirmation();
    }
    public toRejected(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderRejected();
    }

    public toActive(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderActive();
    }

    public toBilled(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderBilled();
    }

    public toCancelled(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderCancelled();
    }

    public isActive(): boolean {
        return false;
    }

    public isBilled(): boolean {
        return false;
    }

    public isPendingConfirmation(): boolean {
        return false;
    }

    public isRejected(): boolean {
        return true;
    }

    public isCancelled(): boolean {
        return true;
    }
}
