import { Order } from "../Order";

export interface IOrderState {
    title: string;
    humanTitle: string;
    color: string;
    toSkipped(order: Order): void;
    isSkipped(): boolean;
}
