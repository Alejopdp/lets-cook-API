import _ from "lodash";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class GetCustomerPaymentOrdersPresenter {
    public present(paymentOrders: PaymentOrder[], countMap: { [key: string]: number }): any {
        const presentedOrders = [];

        const orderedPaymentOrders = _.orderBy(paymentOrders, ["billingDate"], ["desc"]);
        for (let order of orderedPaymentOrders) {
            presentedOrders.push({
                id: order.id.value,
                billingDate: MomentTimeService.getDdMmYyyy(order.billingDate),
                amount: order.getFinalAmount(),
                state: order.state.title,
                humanState: order.state.humanTitle,
                ordersQty: countMap[order.id.value],
                discountAmount: order.discountAmount,
            });
        }

        return { paymentOrders: presentedOrders };
    }
}
