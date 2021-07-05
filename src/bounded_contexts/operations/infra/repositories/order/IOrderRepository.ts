import { CustomerId } from "../../../domain/customer/CustomerId";
import { Locale } from "../../../domain/locale/Locale";
import { Order } from "../../../domain/order/Order";
import { OrderId } from "../../../domain/order/OrderId";
import { PaymentOrderId } from "../../../domain/paymentOrder/PaymentOrderId";
import { Plan } from "../../../domain/plan/Plan";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";
import { Week } from "../../../domain/week/Week";

export interface IOrderRepository {
    save(order: Order): Promise<void>;
    bulkSave(orders: Order[]): Promise<void>;
    findAll(locale: Locale): Promise<Order[]>;
    findById(orderId: OrderId, locale: Locale): Promise<Order | undefined>;
    findBy(conditions: any, locale: Locale): Promise<Order[]>;
    findNextTwelveBySubscription(subscriptionId: SubscriptionId): Promise<Order[]>;
    getCountByPaymentOrderIdMap(paymentOrdersIds: PaymentOrderId[]): Promise<{ [key: string]: number }>;
    findByIdList(ordersIds: OrderId[]): Promise<Order[]>;
    findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[]): Promise<Order[]>;
    findForBilling(subscriptionsIds: SubscriptionId[], week: Week): Promise<Order[]>;
    saveSkippedOrders(orders: Order[]): Promise<void>;
    saveCancelledOrders(orders: Order[]): Promise<void>;
    saveSwappedPlanOrders(orders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): Promise<void>;
    delete(orderId: OrderId): Promise<void>;
}
