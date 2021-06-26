import { IPaymentOrderState } from "./IPaymentOrderState";

export class PaymentOrderActive implements IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_ACTIVE";
        this.humanTitle = "Activa";
        this.color = "green";
    }
}
