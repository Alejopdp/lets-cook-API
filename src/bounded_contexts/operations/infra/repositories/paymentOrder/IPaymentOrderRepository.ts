import { Locale } from "../../../domain/locale/Locale";
import { PaymentOrder } from "../../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../../domain/paymentOrder/PaymentOrderId";

export interface IPaymentOrderRepository {
    save(paymentOrder: PaymentOrder): Promise<void>;
    bulkSave(paymentOrders: PaymentOrder[]): Promise<void>;
    findAll(locale: Locale): Promise<PaymentOrder[]>;
    findById(paymentOrderId: PaymentOrderId, locale: Locale): Promise<PaymentOrder | undefined>;
    findBy(conditions: any, locale: Locale): Promise<PaymentOrder[]>;
    delete(paymentOrderId: PaymentOrderId): Promise<void>;
    // findPaymentOrderById(paymentOrderId: PaymentOrderId): Promise<PaymentOrder | undefined>;
}
