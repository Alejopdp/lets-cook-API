import { PaymentOrder } from "../PaymentOrder";
import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderActive } from "./PaymentOrderActive";
import { PaymentOrderCancelled } from "./PaymentOrderCancelled";
import { PaymentOrderPartiallyRefunded } from "./PaymentOrderPartiallyRefunded";
import { PaymentOrderPendingConfirmation } from "./PaymentOrderPendingConfirmation";
import { PaymentOrderRefunded } from "./PaymentOrderRefunded";
import { PaymentOrderRejected } from "./PaymentOrderRejected";

export class PaymentOrderBilled implements IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_BILLED";
        this.humanTitle = "Pagado";
        this.color = "green";
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

    public toPartiallyRefunded(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderPartiallyRefunded();
    }

    public toRefunded(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderRefunded();
    }

    public isActive(): boolean {
        return false;
    }

    public isBilled(): boolean {
        return true;
    }

    public isPendingConfirmation(): boolean {
        return false;
    }

    public isRejected(): boolean {
        return false;
    }

    public isCancelled(): boolean {
        return false;
    }
}
