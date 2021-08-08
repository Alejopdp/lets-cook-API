import { PaymentOrder } from "../PaymentOrder";
import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderBilled } from "./PaymentOrderBilled";
import { PaymentOrderPendingConfirmation } from "./PaymentOrderPendingConfirmation";
import { PaymentOrderRejected } from "./PaymentOrderRejected";

export class PaymentOrderActive implements IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_ACTIVE";
        this.humanTitle = "Activa";
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

    public isActive(): boolean {
        return true;
    }

    public isBilled(): boolean {
        return false;
    }

    public isPendingConfirmation(): boolean {
        return false;
    }

    public isRejected(): boolean {
        return false;
    }
}
