import { PaymentOrder } from "../PaymentOrder";

export interface IPaymentOrderState {
    title: string;
    humanTitle: string;
    color: string;
    toActive(paymentOrder: PaymentOrder): void;
    toBilled(paymentOrder: PaymentOrder): void;
    toPendingConfirmation(paymentOrder: PaymentOrder): void;
    toRejected(paymentOrder: PaymentOrder): void;
    toCancelled(paymentOrder: PaymentOrder): void
    isActive(): boolean;
    isBilled(): boolean;
    isPendingConfirmation(): boolean;
    isRejected(): boolean;
    isCancelled(): boolean
}
