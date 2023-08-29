import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Day } from "@src/bounded_contexts/operations/domain/day/Day";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";
import { Order } from "@src/bounded_contexts/operations/domain/order/Order";
import { OrderId } from "@src/bounded_contexts/operations/domain/order/OrderId";
import { PaymentOrderId } from "@src/bounded_contexts/operations/domain/paymentOrder/PaymentOrderId";
import { Plan } from "@src/bounded_contexts/operations/domain/plan/Plan";
import { PlanType } from "@src/bounded_contexts/operations/domain/plan/PlanType/PlanType";
import { PlanVariantId } from "@src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariantId";
import { SubscriptionId } from "@src/bounded_contexts/operations/domain/subscription/SubscriptionId";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";
import { WeekId } from "@src/bounded_contexts/operations/domain/week/WeekId";
import { IOrderRepository } from "./IOrderRepository";

export class InMemoryOrderRepository implements IOrderRepository {

    private orders: Order[] = [];

    public constructor(orders: Order[]) {
        this.orders = orders;
    }
    getOrdersForRecipeRatingsExport(tuples: [string, string], locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }

    public async save(order: Order): Promise<void> {
        // If order exists update it in the same order. If not, push it to the array
        const orderIndex = this.orders.findIndex((o) => o.id.equals(order.id));
        if (orderIndex !== -1) {
            this.orders[orderIndex] = order;
            return;
        }
        else {
            this.orders.push(order);
            return;
        }

    }

    public async insertMany(orders: Order[]): Promise<void> {
        this.orders = this.orders.concat(orders);

    }
    public async updateMany(orders: Order[]): Promise<void> {
        orders.forEach((order) => {
            const orderIndex = this.orders.findIndex((o) => o.id.equals(order.id));
            if (orderIndex !== -1) {
                this.orders[orderIndex] = order;
            }
        });
    }
    countCustomersWhoChoseRecipesByWeekGroupedByPlan(week: Week): Promise<{ _id: string; chosenRecipes: number; notChosenRecipes: number; }[]> {
        throw new Error("Method not implemented.");
    }
    countCustomersWhoChoseRecipesByWeekGroupedByNumberOfPersons(week: Week): Promise<{ _id: string; chosenRecipes: number; notChosenRecipes: number; }[]> {
        throw new Error("Method not implemented.");
    }
    countActiveCustomersByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countPlanActiveOrdersByWeek(week: Week, planType: PlanType): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getBilledAmountSumByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getBilledAmountAvgByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getNumberOfPersonsByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countKitsForCookingByWeek(week: Week): Promise<number> {
        throw new Error("Method not implemented.");
    }
    findAll(locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    public async findById(orderId: OrderId, locale: Locale): Promise<Order | undefined> {
        return this.orders.find((order) => order.id.equals(orderId));
    }

    findBy(conditions: any, locale: Locale, sort?: { [field: string]: "asc" | "desc"; } | undefined): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    public async findNextTwelveBySubscription(subscriptionId: SubscriptionId, locale: Locale, queryDate: Date): Promise<Order[]> {
        return this.orders.filter((order) => order.subscriptionId.equals(subscriptionId) && order.shippingDate.getTime() > queryDate.getTime()).sort((o1, o2) => o1.shippingDate.getTime() > o2.shippingDate.getTime() ? 1 : -1);
    }
    getCountByPaymentOrderIdMap(paymentOrdersIds: PaymentOrderId[], locale: Locale): Promise<{ [key: string]: number; }> {
        throw new Error("Method not implemented.");
    }
    public async findByIdList(ordersIds: OrderId[], locale: Locale): Promise<Order[]> {
        return this.orders.filter((order) => ordersIds.some(id => id.equals(order.id)));
    }

    public async findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[], locale: Locale, queryDate: Date): Promise<Order[]> {
        return this.orders.filter((order) => subscriptionsIds.some(id => id.equals(order.subscriptionId)) && order.shippingDate.getTime() >= queryDate.getTime()).sort((o1, o2) => o1.shippingDate > o2.shippingDate ? 1 : -1);
    }
    public async findByIdOrThrow(orderId: OrderId, locale: Locale): Promise<Order> {
        const order = this.orders.find((order) => order.id.equals(orderId));
        if (!order) {
            throw new Error("Order not found");
        }
        return order;
    }
    findForBilling(subscriptionsIds: SubscriptionId[], week: Week, locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findByWeek(weekId: WeekId, locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    public async findByPaymentOrderId(paymentOrderId: PaymentOrderId, locale: Locale): Promise<Order[]> {
        return await this.orders.filter((order) => order.paymentOrderId?.equals(paymentOrderId));
    }
    public async findByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[], locale: Locale): Promise<Order[]> {
        return this.orders.filter((order) => paymentOrdersIds.some(id => id.equals(order.paymentOrderId)));
    }
    findActiveOrdersByPaymentOrderId(paymentOrderId: PaymentOrderId, locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findACtiveOrdersByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[], locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findPastOrdersBySubscriptionIdList(subscriptionsIds: SubscriptionId[], locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findByWeekList(weeksIds: WeekId[], locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findByBillingDates(billingDates: Date[], locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findByShippingDates(shippingDates: Date[], locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findCurrentWeekOrders(locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findFutureOrders(locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findFutureOrdersByShippingDayOfWeek(shippingDay: Day, locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findActiveBySubscriptionIdList(subscriptionsIds: SubscriptionId[]): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    public async findAllByCustomersIds(customersIds: CustomerId[], locale: Locale): Promise<Order[]> {
        return await this.orders.filter((order) => customersIds.some(id => id.equals(order.customer.id)));
    }
    public async findAllBySubscriptionId(subscriptionId: SubscriptionId): Promise<Order[]> {
        return await this.orders.filter((order) => order.subscriptionId.equals(subscriptionId));
    }
    getFirstOrderOfSubscription(subscriptionId: SubscriptionId, locale: Locale): Promise<Order | undefined> {
        throw new Error("Method not implemented.");
    }
    public async saveCancelledOrders(orders: Order[]): Promise<void> {
        this.updateMany(orders)
    }
    saveSwappedPlanOrders(orders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    saveSkippedAndActiveOrders(skippedOrders: Order[], activeOrders: Order[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    saveOrdersWithNewState(orders: Order[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addCustomerToOrderOfSubscription(subscriptionId: SubscriptionId, customerId: CustomerId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findByChosenRecipeAndFutureShippingDate(recipeId: string): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findOneTimeSubscriptionAndFutureOrders(locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    delete(orderId: OrderId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    markAsDeletedBySubscriptionId(subscriptionId: SubscriptionId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    destroyManyBySubscriptionId(subscriptionId: SubscriptionId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    destroyByCustomerId(customerId: CustomerId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findFutureActiveAndSkippedBySubscriptionOrderdByShippingDate(subscriptionId: SubscriptionId, locale: Locale): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }

    /**
 * Getter $orders
 * @return {Order[] }
 */
    public get $orders(): Order[] {
        return this.orders;
    }

    /**
     * Setter $orders
     * @param {Order[] } value
     */
    public set $orders(value: Order[]) {
        this.orders = value;
    }



}