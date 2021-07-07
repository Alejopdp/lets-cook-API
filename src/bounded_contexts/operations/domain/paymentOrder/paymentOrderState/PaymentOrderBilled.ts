import { PaymentOrder } from "../PaymentOrder";
import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderActive } from "./PaymentOrderActive";

export class PaymentOrderBilled implements IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_BILLED";
        this.humanTitle = "Orden pagada";
        this.color = "green";
    }

    public toActive(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderActive();
    }

    public toBilled(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderBilled();
    }
}
