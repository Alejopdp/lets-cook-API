import { CustomerId } from "../../../domain/customer/CustomerId";
import { Locale } from "../../../domain/locale/Locale";
import { Order } from "../../../domain/order/Order";
import { OrderId } from "../../../domain/order/OrderId";
import { Plan } from "../../../domain/plan/Plan";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";

export interface IOrderRepository {
    save(order: Order): Promise<void>;
    bulkSave(orders: Order[]): Promise<void>;
    findAll(locale: Locale): Promise<Order[]>;
    findById(orderId: OrderId, locale: Locale): Promise<Order | undefined>;
    findBy(conditions: any, locale: Locale): Promise<Order[]>;
    findNextTwelveBySubscription(subscriptionId: SubscriptionId): Promise<Order[]>;
    findByIdList(ordersIds: OrderId[]): Promise<Order[]>;
    findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[]): Promise<Order[]>;
    saveSkippedOrders(orders: Order[]): Promise<void>;
    saveCancelledOrders(orders: Order[]): Promise<void>;
    saveSwappedPlanOrders(orders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): Promise<void>;
    delete(orderId: OrderId): Promise<void>;
}
