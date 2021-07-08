import { PaymentOrder } from "../PaymentOrder";
import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderBilled } from "./PaymentOrderBilled";

export class PaymentOrderActive implements IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_ACTIVE";
        this.humanTitle = "Activa";
        this.color = "green";
    }

    public toActive(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderActive();
    }

    public toBilled(paymentOrder: PaymentOrder): void {
        paymentOrder.state = new PaymentOrderBilled();
    }
}
