import { Day } from "../../../domain/day/Day";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Locale } from "../../../domain/locale/Locale";
import { Order } from "../../../domain/order/Order";
import { OrderId } from "../../../domain/order/OrderId";
import { PaymentOrderId } from "../../../domain/paymentOrder/PaymentOrderId";
import { Plan } from "../../../domain/plan/Plan";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";
import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";
import { PlanType } from "@src/bounded_contexts/operations/domain/plan/PlanType/PlanType";

export interface IOrderRepository {
    save(order: Order): Promise<void>;
    bulkSave(orders: Order[]): Promise<void>;
    updateMany(orders: Order[]): Promise<void>;
    countCustomersWhoChoseRecipesByWeekGroupedByPlan(
        week: Week
    ): Promise<{ _id: string; chosenRecipes: number; notChosenRecipes: number }[]>;
    countCustomersWhoChoseRecipesByWeekGroupedByNumberOfPersons(
        week: Week
    ): Promise<{ _id: string; chosenRecipes: number; notChosenRecipes: number }[]>;

    countActiveCustomersByWeek(week: Week): Promise<number>;
    countPlanActiveOrdersByWeek(week: Week, planType: PlanType): Promise<number>;
    getBilledAmountSumByWeek(week: Week): Promise<number>;
    getBilledAmountAvgByWeek(week: Week): Promise<number>;
    getNumberOfPersonsByWeek(week: Week): Promise<number>;
    countKitsForCookingByWeek(week: Week): Promise<number>;
    findAll(locale: Locale): Promise<Order[]>;
    findById(orderId: OrderId, locale: Locale): Promise<Order | undefined>;
    findBy(conditions: any, locale: Locale): Promise<Order[]>;
    findNextTwelveBySubscription(subscriptionId: SubscriptionId, locale: Locale): Promise<Order[]>;
    getCountByPaymentOrderIdMap(paymentOrdersIds: PaymentOrderId[], locale: Locale): Promise<{ [key: string]: number }>;
    findByIdList(ordersIds: OrderId[], locale: Locale): Promise<Order[]>;
    findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[], locale: Locale): Promise<Order[]>;
    findByIdOrThrow(orderId: OrderId, locale: Locale): Promise<Order>;
    findForBilling(subscriptionsIds: SubscriptionId[], week: Week, locale: Locale): Promise<Order[]>;
    findByWeek(weekId: WeekId, locale: Locale): Promise<Order[]>;
    findByPaymentOrderId(paymentOrderId: PaymentOrderId, locale: Locale): Promise<Order[]>;
    findByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[], locale: Locale): Promise<Order[]>;
    findActiveOrdersByPaymentOrderId(paymentOrderId: PaymentOrderId, locale: Locale): Promise<Order[]>;
    findACtiveOrdersByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[], locale: Locale): Promise<Order[]>;
    findPastOrdersBySubscriptionIdList(subscriptionsIds: SubscriptionId[], locale: Locale): Promise<Order[]>;
    findByWeekList(weeksIds: WeekId[], locale: Locale): Promise<Order[]>;
    findByBillingDates(billingDates: Date[], locale: Locale): Promise<Order[]>;
    findByShippingDates(shippingDates: Date[], locale: Locale): Promise<Order[]>;
    findCurrentWeekOrders(locale: Locale): Promise<Order[]>;
    findFutureOrders(locale: Locale): Promise<Order[]>;
    findFutureOrdersByShippingDayOfWeek(shippingDay: Day, locale: Locale): Promise<Order[]>;
    findActiveBySubscriptionIdList(subscriptionsIds: SubscriptionId[]): Promise<Order[]>;
    findAllByCustomersIds(customersIds: CustomerId[], locale: Locale): Promise<Order[]>;
    findAllBySubscriptionId(subscriptionId: SubscriptionId): Promise<Order[]>;
    getFirstOrderOfSubscription(subscriptionId: SubscriptionId, locale: Locale): Promise<Order | undefined>;
    saveCancelledOrders(orders: Order[]): Promise<void>;
    saveSwappedPlanOrders(orders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): Promise<void>;
    saveSkippedAndActiveOrders(skippedOrders: Order[], activeOrders: Order[]): Promise<void>;
    saveOrdersWithNewState(orders: Order[]): Promise<void>;
    addCustomerToOrderOfSubscription(subscriptionId: SubscriptionId, customerId: CustomerId): Promise<void>;
    findByChosenRecipeAndFutureShippingDate(recipeId: string): Promise<Order[]>;
    findOneTimeSubscriptionAndFutureOrders(locale: Locale): Promise<Order[]>;
    delete(orderId: OrderId): Promise<void>;
    markAsDeletedBySubscriptionId(subscriptionId: SubscriptionId): Promise<void>;
    destroyManyBySubscriptionId(subscriptionId: SubscriptionId): Promise<void>;
    findFutureActiveAndSkippedBySubscriptionOrderdByShippingDate(subscriptionId: SubscriptionId, locale: Locale): Promise<Order[]>;
}
