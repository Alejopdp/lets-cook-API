import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderActive } from "./PaymentOrderActive";

export class PaymentOrderStateFactory {
    public static createState(stateTitle: string): IPaymentOrderState {
        switch (stateTitle) {
            case "PAYMENT_ORDER_ACTIVE":
                return new PaymentOrderActive();
            default:
                throw new Error("Wrong payment order state");
        }
    }
}
