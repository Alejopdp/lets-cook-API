import _ from "lodash";
import { Customer } from "../../domain/customer/Customer";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class GetPaymentOrdersAsAdminPresenter {
    public present(paymentOrders: PaymentOrder[], customers: Customer[]): any {
        const activeOrders: PaymentOrder[] = [];
        const billedOrders: PaymentOrder[] = [];
        const rejectedOrders: PaymentOrder[] = [];
        const customerMap: { [customerId: string]: Customer } = {};

        for (let customer of customers) {
            customerMap[customer.id.value] = customer;
        }

        for (let paymentOrder of paymentOrders) {
            const presentedOrder = this.presentPaymentOrder(paymentOrder, customerMap[paymentOrder.customerId.value]);

            if (paymentOrder.state.title === "PAYMENT_ORDER_ACTIVE") activeOrders.push(presentedOrder);
            if (
                paymentOrder.state.title === "PAYMENT_ORDER_BILLED" ||
                paymentOrder.state.title === "PAYMENT_ORDER_REFUNDED" ||
                paymentOrder.state.title === "PAYMENT_ORDER_PARTIALLY_REFUNDED"
            )
                billedOrders.push(presentedOrder);
            if (paymentOrder.state.title === "PAYMENT_ORDER_REJECTED") rejectedOrders.push(presentedOrder);
        }

        return {
            activeOrders: activeOrders.sort((po1, po2) =>
                !!!po1.lastRecipeSelectionDate
                    ? 1
                    : !!!po2.lastRecipeSelectionDate
                    ? -1
                    : po2.lastRecipeSelectionDate.getTime() - po1.lastRecipeSelectionDate.getTime()
            ),
            billedOrders: billedOrders.sort((po1, po2) =>
                !!!po1.lastRecipeSelectionDate
                    ? 1
                    : !!!po2.lastRecipeSelectionDate
                    ? -1
                    : po2.lastRecipeSelectionDate.getTime() - po1.lastRecipeSelectionDate.getTime()
            ),
            rejectedOrders,
        };
    }

    public presentPaymentOrder(paymentOrder: PaymentOrder, customer: Customer): any {
        return {
            id: paymentOrder.id.value,
            originalBillingDate: paymentOrder.billingDate,
            billingDate: paymentOrder.getDdMmYyyyBillingDate(),
            customerName: customer.getPersonalInfo()?.fullName,
            customerEmail: customer.email,
            customerId: customer.id.value,
            state: paymentOrder.state.title,
            amount: paymentOrder.getFinalAmount(),
            paymentIntentId: paymentOrder.paymentIntentId,
            lastRecipeSelectionDate: paymentOrder.lastRecipeSelectionDate,
            humanId: paymentOrder.getHumanIdOrIdValue(),
        };
    }
}
