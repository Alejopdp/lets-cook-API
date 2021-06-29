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

export class MongooseOrderRepository implements IOrderRepository {
    public async save(order: Order): Promise<void> {
        const orderDb = orderMapper.toPersistence(order);
        if (await MongooseOrder.exists({ _id: order.id.value })) {
            await MongooseOrder.updateOne({ _id: order.id.value }, orderDb);
        } else {
            await MongooseOrder.create(orderDb);
        }
    }

    public async bulkSave(Orders: Order[]): Promise<void> {
        const ordersToSave = Orders.map((Order) => orderMapper.toPersistence(Order));

        await MongooseOrder.create(ordersToSave);
    }

    public async saveSkippedOrders(orders: Order[]): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { state: "ORDER_SKIPPED" });
    }

    public async saveCancelledOrders(orders: Order[]): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { state: "ORDER_CANCELLED" });
    }

    public async saveSwappedPlanOrders(orders: Order[], newPlan: Plan, newPlanVariantId: PlanVariantId): Promise<void> {
        const ordersIdToSave = orders.map((order) => order.id.value);

        await MongooseOrder.updateMany({ _id: ordersIdToSave }, { plan: newPlan.id.value, planVariant: newPlanVariantId.value });
    }

    public async findById(orderId: OrderId, locale: Locale): Promise<Order | undefined> {
        const orderDb = await MongooseOrder.findById(orderId.value, { deletionFlag: false })
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week");

        return orderDb ? orderMapper.toDomain(orderDb, locale) : undefined;
    }

    public async findAll(locale: Locale): Promise<Order[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale?: Locale): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false })
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week");

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    private async findByLimited(conditions: any, locale?: Locale): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false })
            .sort({ shippingDate: 1 })
            // .limit(12)
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week");

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    public async findByIdList(ordersIds: OrderId[]): Promise<Order[]> {
        return await this.findBy({ _id: ordersIds.map((id) => id.value) });
    }

    public async findNextTwelveBySubscription(subscriptionId: SubscriptionId): Promise<Order[]> {
        return await this.findBy({ subscription: subscriptionId.value });
    }

    public async findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[]): Promise<Order[]> {
        return await this.findByLimited({ subscription: { $in: subscriptionsIds.map((id) => id.value) } });
    }

    public async delete(orderId: OrderId): Promise<void> {
        await MongooseOrder.updateOne({ _id: orderId.value }, { deletionFlag: true });
    }
}
