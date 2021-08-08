import { IPaymentOrderState } from "./IPaymentOrderState";
import { PaymentOrderActive } from "./PaymentOrderActive";
import { PaymentOrderBilled } from "./PaymentOrderBilled";
import { PaymentOrderPendingConfirmation } from "./PaymentOrderPendingConfirmation";
import { PaymentOrderRejected } from "./PaymentOrderRejected";

export class PaymentOrderStateFactory {
    public static createState(stateTitle: string): IPaymentOrderState {
        switch (stateTitle) {
            case "PAYMENT_ORDER_ACTIVE":
                return new PaymentOrderActive();
            case "PAYMENT_ORDER_BILLED":
                return new PaymentOrderBilled();
            case "PAYMENT_ORDER_PENDING_CONFIRMATION":
                return new PaymentOrderPendingConfirmation();
            case "PAYMENT_ORDER_REJECTED":
                return new PaymentOrderRejected();
            default:
                throw new Error("Wrong payment order state");
        }
    }
}
