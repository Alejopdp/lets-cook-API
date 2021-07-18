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

        await MongooseOrder.insertMany(ordersToSave);
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

    public async getCountByPaymentOrderIdMap(paymentOrdersIds: PaymentOrderId[]): Promise<{ [key: string]: number }> {
        const ordersDb = await MongooseOrder.find({ paymentOrder: paymentOrdersIds.map((id) => id.value), deletionFlag: false });
        const map: { [key: string]: number } = {};

        for (let orderDb of ordersDb) {
            map[orderDb.paymentOrder!] = map[orderDb.paymentOrder!] ? map[orderDb.paymentOrder!] + 1 : 1;
        }

        return map;
    }

    public async findByPaymentOrderId(paymentOrderId: PaymentOrderId): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrderId.value });
    }
    public async findById(orderId: OrderId, locale: Locale): Promise<Order | undefined> {
        const orderDb = await MongooseOrder.findById(orderId.value, { deletionFlag: false })
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({ path: "recipeSelection.recipe", populate: { path: "recipesVariants", populate: { path: "restrictions" } } });

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
        });

        return ordersDb.map((order) => orderMapper.toDomain(order));
    }

    public async findAll(locale: Locale): Promise<Order[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale?: Locale): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false })
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({ path: "recipes", populate: { path: "recipesVariants", populate: { path: "restrictions" } } });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    private async findByLimited(conditions: any, locale?: Locale): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false, shippingDate: { $gte: new Date() } })
            .sort({ shippingDate: 1 })
            // .limit(12)
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({ path: "recipeSelection.recipe", populate: { path: "recipesVariants", populate: { path: "restrictions" } } });

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
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({ path: "recipeSelection.recipe", populate: { path: "recipesVariants", populate: { path: "restrictions" } } });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, Locale.es));
    }

    public async findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[]): Promise<Order[]> {
        return await this.findByLimited({ subscription: { $in: subscriptionsIds.map((id) => id.value) } });
    }

    public async delete(orderId: OrderId): Promise<void> {
        await MongooseOrder.updateOne({ _id: orderId.value }, { deletionFlag: true });
    }
}
