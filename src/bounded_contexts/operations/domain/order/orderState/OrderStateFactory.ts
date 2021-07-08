import { IOrderState } from "./IOrderState";
import { OrderActive } from "./OrderActive";
import { OrderBilled } from "./OrderBilled";
import { OrderCancelled } from "./OrderCancelled";
import { OrderSkipped } from "./OrderSkipped";

export class OrderStateFactory {
    public static createState(stateTitle: string): IOrderState {
        switch (stateTitle) {
            case "ORDER_ACTIVE":
                return new OrderActive();
            case "ORDER_SKIPPED":
                return new OrderSkipped();
            case "ORDER_CANCELLED":
                return new OrderCancelled();
            case "ORDER_BILLED":
                return new OrderBilled();
            default:
                throw new Error("Wrong order state");
        }
    }
}
