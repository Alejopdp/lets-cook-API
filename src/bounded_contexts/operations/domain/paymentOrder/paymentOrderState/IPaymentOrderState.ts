import { PaymentOrder } from "../PaymentOrder";

export interface IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;
    toActive(paymentOrder: PaymentOrder): void;
    toBilled(paymentOrder: PaymentOrder): void;
}
