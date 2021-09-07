import { Order } from "../../../domain/order/Order";
import { OrderId } from "../../../domain/order/OrderId";
import { IOrderRepository } from "./IOrderRepository";
import { Order as MongooseOrder } from "../../../../../infraestructure/mongoose/models";
import { orderMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";
import { Plan } from "../../../domain/plan/Plan";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Week } from "../../../domain/week/Week";
import { PaymentOrderId } from "../../../domain/paymentOrder/PaymentOrderId";
import { WeekId } from "../../../domain/week/WeekId";

export class MongooseOrderRepository implements IOrderRepository {
    public async save(order: Order): Promise<void> {
        const orderDb = orderMapper.toPersistence(order);
        if (await MongooseOrder.exists({ _id: order.id.value })) {
            await MongooseOrder.updateOne({ _id: order.id.value }, orderDb);
        } else {
            await MongooseOrder.create(orderDb);
        }
    }

    public async bulkSave(orders: Order[]): Promise<void> {
        const ordersToSave = orders.map((order) => orderMapper.toPersistence(order));

        await MongooseOrder.insertMany(ordersToSave);
    }

    public async saveOrdersWithNewState(orders: Order[]): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { state: orders[0].state.title }); // All orders should have the same State
    }

    public async saveSkippedAndActiveOrders(skippedOrders: Order[], activeOrders: Order[]): Promise<void> {
        if (skippedOrders.length > 0) await this.saveSkippedOrders(skippedOrders);
        if (activeOrders.length > 0) await this.saveAciveOrders(activeOrders);
    }

    private async saveSkippedOrders(orders: Order[]): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { state: "ORDER_SKIPPED" });
    }

    private async saveAciveOrders(orders: Order[]): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { state: "ORDER_ACTIVE" });
    }

    public async saveCancelledOrders(orders: Order[]): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { state: "ORDER_CANCELLED" });
    }

    public async saveSwappedPlanOrders(orders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { plan: newPlan.id.value, planVariant: newPlanVariantId.value });
    }

    public async getCountByPaymentOrderIdMap(paymentOrdersIds: PaymentOrderId[]): Promise<{ [key: string]: number }> {
        const ordersDb = await MongooseOrder.find({ paymentOrder: paymentOrdersIds.map((id) => id.value), deletionFlag: false });
        const map: { [key: string]: number } = {};

        for (let orderDb of ordersDb) {
            map[orderDb.paymentOrder!] = map[orderDb.paymentOrder!] ? map[orderDb.paymentOrder!] + 1 : 1;
        }

        return map;
    }

    public async getFirstOrderOfSubscription(subscriptionId: SubscriptionId): Promise<Order | undefined> {
        const orderDb = await MongooseOrder.findOne({ subscription: subscriptionId.value })
            .sort({ shippingDate: 1 })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: { path: "recipe", populate: { path: "recipeVariants", populate: { path: "restriction" } } },
            });

        return orderDb ? orderMapper.toDomain(orderDb) : undefined;
    }

    public async findByPaymentOrderId(paymentOrderId: PaymentOrderId): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrderId.value });
    }

    public async findByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[]): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrdersIds.map((id) => id.value) });
    }

    public async findActiveOrdersByPaymentOrderId(paymentOrderId: PaymentOrderId): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrderId.value, state: "ORDER_ACTIVE" });
    }

    public async findACtiveOrdersByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[]): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrdersIds.map((id) => id.value), state: "ORDER_ACTIVE" });
    }

    public async findById(orderId: OrderId, locale: Locale): Promise<Order | undefined> {
        const orderDb = await MongooseOrder.findById(orderId.value, { deletionFlag: false })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: { path: "recipe", populate: { path: "recipeVariants", populate: { path: "restriction" } } },
            });

        return orderDb ? orderMapper.toDomain(orderDb, locale) : undefined;
    }

    public async findByIdOrThrow(orderId: OrderId): Promise<Order> {
        const order: Order | undefined = await this.findById(orderId, Locale.es);

        if (!!!order) throw new Error("La orden ingresada no existe");

        return order;
    }

    public async findForBilling(subscriptionsIds: SubscriptionId[], week: Week): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({
            subscription: subscriptionsIds.map((id) => id.value),
            state: "ORDER_ACTIVE",
            week: week.id.value,
        })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: { path: "recipe", populate: { path: "recipeVariants", populate: { path: "restriction" } } },
            });

        return ordersDb.map((order: any) => orderMapper.toDomain(order));
    }

    public async findAll(locale: Locale): Promise<Order[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale?: Locale): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: { path: "recipe", populate: { path: "recipeVariants", populate: { path: "restriction" } } },
            });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    private async findByLimited(conditions: any, locale?: Locale): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false, shippingDate: { $gte: new Date() } })
            .sort({ shippingDate: 1 })
            // .limit(12)
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: { path: "recipe", populate: { path: "recipeVariants", populate: { path: "restriction" } } },
            });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    public async findByIdList(ordersIds: OrderId[]): Promise<Order[]> {
        return await this.findBy({ _id: ordersIds.map((id) => id.value) });
    }

    public async findNextTwelveBySubscription(subscriptionId: SubscriptionId): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({
            subscription: subscriptionId.value,
            deletionFlag: false,
            shippingDate: { $gte: new Date() },
        })
            .sort({ shippingDate: 1 })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: { path: "recipe", populate: { path: "recipeVariants", populate: { path: "restriction" } } },
            });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, Locale.es));
    }

    public async findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[]): Promise<Order[]> {
        return await this.findByLimited({ subscription: { $in: subscriptionsIds.map((id) => id.value) } });
    }

    public async findByWeek(weekId: WeekId): Promise<Order[]> {
        return await this.findBy({ week: weekId.value });
    }

    public async findPastOrdersByCustomerIdList(subscriptionsIds: SubscriptionId[]): Promise<Order[]> {
        return await this.findBy({
            state: "ORDER_BILLED",
            subscription: subscriptionsIds.map((id) => id.value),
            shippingDate: { $lte: new Date() },
        });
    }

    public async findByWeekList(weeksIds: WeekId[]): Promise<Order[]> {
        return await this.findBy({ week: weeksIds.map((id) => id.value) });
    }

    public async findByBillingDates(billingDates: Date[]): Promise<Order[]> {
        billingDates.forEach((date) => date.setHours(0, 0, 0, 0));
        return await this.findBy({ billingDate: billingDates });
    }

    public async findByShippingDates(shippingDates: Date[]): Promise<Order[]> {
        shippingDates.forEach((date) => date.setHours(0, 0, 0, 0));
        return await this.findBy({ shippingDate: shippingDates });
    }

    public async findCurrentWeekOrders(): Promise<Order[]> {
        const today = new Date();
        const thisWeekMinDay = new Date();
        const thisWeekMaxDay = new Date();

        thisWeekMinDay.setDate(thisWeekMinDay.getDate() + (0 - today.getDay()));
        thisWeekMaxDay.setDate(thisWeekMaxDay.getDate() + (6 - today.getDay()));

        return await this.findBy({ shippingDate: { $gte: thisWeekMinDay, $lte: thisWeekMaxDay } });
    }

    public async findAllByCustomersIds(customersIds: CustomerId[]): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ customer: customersIds.map((id) => id.value), deletionFlag: false })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: { path: "recipe", populate: { path: "recipeVariants", populate: { path: "restriction" } } },
            });

        return ordersDb.map((order: any) => orderMapper.toDomain(order));
    }

    public async addCustomerToOrderOfSubscription(subscriptionId: SubscriptionId, customerId: CustomerId): Promise<void> {
        await MongooseOrder.updateMany({ subscription: subscriptionId.value }, { customer: customerId.value });
    }

    public async delete(orderId: OrderId): Promise<void> {
        await MongooseOrder.updateOne({ _id: orderId.value }, { deletionFlag: true });
    }
}
