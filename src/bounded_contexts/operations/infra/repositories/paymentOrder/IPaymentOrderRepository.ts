import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Locale } from "../../../domain/locale/Locale";
import { PaymentOrder } from "../../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../../domain/paymentOrder/PaymentOrderId";
import { Subscription } from "../../../domain/subscription/Subscription";

export interface IPaymentOrderRepository {
    save(paymentOrder: PaymentOrder): Promise<void>;
    bulkSave(paymentOrders: PaymentOrder[]): Promise<void>;
    updateMany(paymentOrders: PaymentOrder[]): Promise<void>;
    countHalfWeekOrdersByWeek(week: Week): Promise<number>;
    findAll(locale: Locale): Promise<PaymentOrder[]>;
    findAllSortedByBillingDateAsc(locale: Locale): Promise<PaymentOrder[]>;
    findById(paymentOrderId: PaymentOrderId, locale: Locale): Promise<PaymentOrder | undefined>;
    findByIdOrThrow(paymentOrderId: PaymentOrderId): Promise<PaymentOrder>;
    findBy(conditions: any, locale: Locale): Promise<PaymentOrder[]>;
    findByCustomerId(customerId: CustomerId): Promise<PaymentOrder[]>;
    findNextTwelveByCustomer(customerId: CustomerId): Promise<PaymentOrder[]>;
    findFutureOrdersByCustomer(customerId: CustomerId): Promise<PaymentOrder[]>;
    findActiveByCustomerAndBillingDate(billingDate: Date, customerId: CustomerId): Promise<PaymentOrder | undefined>;
    findActiveByCustomerAndBillingDateList(billingDates: Date[], customerId: CustomerId): Promise<PaymentOrder[]>;
    findActiveByBillingDate(billingDate: Date): Promise<PaymentOrder[]>;
    findByBillingDateList(billingDateList: Date[], customerId: CustomerId): Promise<PaymentOrder[]>;
    findByBillingDate(billingDate: Date): Promise<PaymentOrder[]>;
    findByIdList(paymentOrdersIds: PaymentOrderId[]): Promise<PaymentOrder[]>;
    findAnActivePaymentOrder(): Promise<PaymentOrder | undefined>;
    findActiveByCustomerIdsList(customerIds: CustomerId[]): Promise<PaymentOrder[]>;
    findByWeeks(weekIds: WeekId[]): Promise<PaymentOrder[]>;
    countPaymentOrdersWithHumanId(): Promise<number>;
    updateShippingCost(paymentOrders: PaymentOrder[], shippingCost: number): Promise<void>;
    existsBy(customerId: CustomerId): Promise<boolean>;
    delete(paymentOrderId: PaymentOrderId): Promise<void>;
    findByCustomerIdsList(customerIds: CustomerId[]): Promise<PaymentOrder[]>
}
