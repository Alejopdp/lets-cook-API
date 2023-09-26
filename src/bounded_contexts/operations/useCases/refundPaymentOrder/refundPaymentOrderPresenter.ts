import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class RefundPaymentOrderPresenter {
    public present(paymentOrder: PaymentOrder): any {
        return {
            id: paymentOrder.id.value,
            state: paymentOrder.state.title,
            quantityRefunded: paymentOrder.quantityRefunded,
        };
    }
}
