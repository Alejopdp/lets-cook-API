import { weekMapper } from ".";
import { Mapper } from "../../../core/infra/Mapper";
import { CustomerId } from "../domain/customer/CustomerId";
import { Locale } from "../domain/locale/Locale";
import { PaymentOrder } from "../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../domain/paymentOrder/PaymentOrderId";
import { IPaymentOrderState } from "../domain/paymentOrder/paymentOrderState/IPaymentOrderState";
import { PaymentOrderStateFactory } from "../domain/paymentOrder/paymentOrderState/PaymentOrderFactory";
import { Week } from "../domain/week/Week";

export class PaymentOrderMapper implements Mapper<PaymentOrder> {
    public toDomain(raw: any, locale?: Locale): PaymentOrder {
        const state: IPaymentOrderState = PaymentOrderStateFactory.createState(raw.state);
        const week: Week = weekMapper.toDomain(raw.week);

        return new PaymentOrder(
            raw.shippingDate,
            state,
            raw.paymentIntentId,
            new Date(raw.billingDate),
            week,
            raw.amount / 100,
            raw.discountAmount / 100,
            // raw.amount,
            // raw.discountAmount,
            raw.shippingCost,
            new CustomerId(raw.customer),
            raw.hasFreeShipping,
            raw.quantityRefunded,
            new PaymentOrderId(raw._id)
        );
    }

    public toPersistence(t: PaymentOrder, locale?: Locale) {
        return {
            shippingDate: t.shippingDate,
            shippingCost: t.shippingCost,
            paymentIntentId: t.paymentIntentId,
            billingDate: t.billingDate,
            week: t.week.id.value,
            amount: Math.round(t.amount * 100),
            discountAmount: Math.round(t.discountAmount * 100),
            // amount: t.amount,
            // discountAmount: t.discountAmount,
            _id: t.id.value,
            state: t.state.title,
            customer: t.customerId.value,
            hasFreeShipping: t.hasFreeShipping,
            quantityRefunded: t.quantityRefunded,
        };
    }
}
