import { IPaymentOrdereState } from "./IPaymentOrderState";

export class PaymentOrderActive implements IPaymentOrdereState {
    title: string;
    humanTitle: string;
    color: string;

    constructor() {
        this.title = "PAYMENT_ORDER_ACTIVE";
        this.humanTitle = "Activa";
        this.color = "green";
    }
}
