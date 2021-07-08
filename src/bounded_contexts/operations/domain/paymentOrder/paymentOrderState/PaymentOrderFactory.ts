import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderActive } from "./PaymentOrderActive";
import { PaymentOrderBilled } from "./PaymentOrderBilled";

export class PaymentOrderStateFactory {
    public static createState(stateTitle: string): IPaymentOrderState {
        switch (stateTitle) {
            case "PAYMENT_ORDER_ACTIVE":
                return new PaymentOrderActive();
            case "PAYMENT_ORDER_BILLED":
                return new PaymentOrderBilled();
            default:
                throw new Error("Wrong payment order state");
        }
    }
}
