import { PaymentOrder } from "../PaymentOrder";
import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderActive } from "./PaymentOrderActive";
import { PaymentOrderBilled } from "./PaymentOrderBilled";
import { PaymentOrderCancelled } from "./PaymentOrderCancelled";
import { PaymentOrderRejected } from "./PaymentOrderRejected";

export class PaymentOrderPendingConfirmation implements IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_PENDING_CONFIRMATION";
        this.humanTitle = "Orden pendiente de pago";
        this.color = "orange";
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
        return true;
    }

    public isRejected(): boolean {
        return false;
    }

    public isCancelled(): boolean {
        return true;
    }
}
