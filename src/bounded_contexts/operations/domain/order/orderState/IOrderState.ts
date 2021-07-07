import { Order } from "../Order";

export interface IOrderState {
    title: string;
    humanTitle: string;
    color: string;
    toSkipped(order: Order): void;
    toCancelled(order: Order): void;
    toActive(order: Order): void;
    toBilled(order: Order): void;
    isSkipped(): boolean;
    isCancelled(): boolean;
    isActive(): boolean;
}
