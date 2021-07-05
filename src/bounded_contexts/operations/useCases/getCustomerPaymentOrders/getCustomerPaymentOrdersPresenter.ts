import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class GetCustomerPaymentOrdersPresenter {
    public present(paymentOrders: PaymentOrder[], countMap: { [key: string]: number }): any {
        const presentedOrders = [];

        for (let order of paymentOrders) {
            presentedOrders.push({
                id: order.id.value,
                billingDate: order.getHumanBillingDate(),
                amount: order.amount,
                state: order.state.humanTitle,
                ordersQty: countMap[order.id.value],
            });
        }

        return { paymentOrders: presentedOrders };
    }
}
