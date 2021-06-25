import { IOrderState } from "./IOrderState";
import { OrderActive } from "./OrderActive";

export class OrderStateFactory {
    public static createState(stateTitle: string): IOrderState {
        switch (stateTitle) {
            case "ORDER_ACTIVE":
                return new OrderActive();
            case "ORDER_SKIPPED":
                return new OrderActive();
            case "ORDER_CANCELLED":
                return new OrderActive();
            default:
                throw new Error("Wrong order state");
        }
    }
}
