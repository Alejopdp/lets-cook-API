import { Order } from "../Order";

export interface IOrderState {
    title: string;
    humanTitle: string;
    color: string;
    toSkipped(order: Order): void;
    toCancelled(order: Order): void;
    toActive(order: Order): void;
    toBilled(order: Order): void;
    toPaymentPending(order: Order): void;
    toPaymentRejected(order: Order): void;
    isBilled(): boolean;
    isSkipped(): boolean;
    isCancelled(): boolean;
    isActive(): boolean;
    isPendingPayment(): boolean;
    isPaymentRejected(): boolean;
}
