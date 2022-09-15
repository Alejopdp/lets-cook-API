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
import { Day } from "../../../domain/day/Day";
import { PlanType } from "@src/bounded_contexts/operations/domain/plan/PlanType/PlanType";

export class MongooseOrderRepository implements IOrderRepository {
    public async save(order: Order): Promise<void> {
        const orderDb = orderMapper.toPersistence(order);
        if (await MongooseOrder.exists({ _id: order.id.value })) {
            await MongooseOrder.updateOne({ _id: order.id.value }, orderDb);
        } else {
            const orderToSave = new MongooseOrder(orderDb);
            // await MongooseOrder.create(orderDb);
            await orderToSave.save();
        }
    }

    public async bulkSave(orders: Order[]): Promise<void> {
        const ordersToSave = orders.map((order) => orderMapper.toPersistence(order));

        await MongooseOrder.insertMany(ordersToSave);
    }

    public async updateMany(orders: Order[]): Promise<void> {
        for (let order of orders) {
            await this.save(order);
        }
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
        const ordersToSave = orders.map((order) => orderMapper.toPersistence(order));

        await MongooseOrder.updateMany(
            { _id: ordersIdToSave },
            { plan: newPlan.id.value, planVariant: newPlanVariantId.value, price: newPlan.getPlanVariantPrice(newPlanVariantId) }
        );
    }

    public async countPlanActiveOrdersByWeek(week: Week, planType: PlanType): Promise<number> {
        const aggregateCount = await MongooseOrder.aggregate()
            .project({ plan: 1, shippingDate: 1, state: 1, week: 1 })
            .match({ week: week.id.toString(), state: { $in: ["ORDER_ACTIVE", "ORDER_BILLED"] } })
            .lookup({ from: "Plan", localField: "plan", foreignField: "_id", as: "plan" })
            .unwind("plan")
            .addFields({ planType: "$plan.type" })
            .match({ planType: planType })
            .count("count");

        return aggregateCount[0]?.count ?? 0;
    }

    public async countKitsForCookingByWeek(week: Week): Promise<number> {
        const result = await MongooseOrder.aggregate()
            .project({ state: 1, shippingDate: 1, planVariant: 1, plan: 1, week: 1 })
            .lookup({
                from: "Plan",
                localField: "plan",
                foreignField: "_id",
                as: "plan",
            })
            .unwind("plan")
            .match({ week: week.id.toString(), state: { $in: ["ORDER_ACTIVE", "ORDER_BILLED"] } })
            .addFields({
                numberOfRecipes: {
                    $reduce: {
                        input: "$plan.variants",
                        in: {
                            $cond: {
                                if: { $eq: ["$$this._id", "$planVariant"] },
                                then: { $ifNull: ["$$this.numberOfRecipes", "$$value"] },
                                else: "$$value",
                            },
                        },
                        initialValue: 0,
                    },
                },
            })
            .group({
                _id: null,
                numberOfRecipesSum: { $sum: "$numberOfRecipes" },
            });

        return result[0]?.numberOfRecipesSum ?? 0;
    }

    public async countCustomersWhoChoseRecipesByWeekGroupedByPlan(
        week: Week
    ): Promise<{ _id: string; chosenRecipes: number; notChosenRecipes: number }[]> {
        const group = await MongooseOrder.aggregate()
            .project({ _id: 1, state: 1, week: 1, plan: 1, recipeSelection: 1 })
            .lookup({
                from: "Plan",
                localField: "plan",
                foreignField: "_id",
                as: "plan",
            })
            .unwind("$plan")
            .match({
                week: week.id.toString(),
            })
            .sort({ "plan.name.es": -1 })
            .group({
                _id: "$plan.name.es",
                chosenRecipes: { $sum: { $cond: { if: { $gt: [{ $size: "$recipeSelection" }, 0] }, then: 1, else: 0 } } },
                notChosenRecipes: { $sum: { $cond: { if: { $gt: [{ $size: "$recipeSelection" }, 0] }, then: 0, else: 1 } } },
            });

        return group;
    }

    public async countCustomersWhoChoseRecipesByWeekGroupedByNumberOfPersons(
        week: Week
    ): Promise<{ _id: string; chosenRecipes: number; notChosenRecipes: number }[]> {
        const group = await MongooseOrder.aggregate()
            .project({ _id: 1, state: 1, week: 1, plan: 1, recipeSelection: 1, planVariant: 1 })
            .lookup({
                from: "Plan",
                localField: "plan",
                foreignField: "_id",
                as: "plan",
            })
            .unwind("$plan")
            .match({
                week: week.id.toString(),
            })
            .sort({ "plan.name.es": -1 })
            .addFields({
                // match planVariant field with looked up plan variants array field and get number of persons
                numberOfPersons: {
                    $reduce: {
                        input: "$plan.variants",
                        in: {
                            $cond: {
                                if: { $eq: ["$$this._id", "$planVariant"] },
                                then: { $ifNull: ["$$this.numberOfPersons", "$$value"] },
                                else: "$$value",
                            },
                        },
                        initialValue: 0,
                    },
                },
            })
            .group({
                _id: "$numberOfPersons",
                chosenRecipes: { $sum: { $cond: { if: { $gt: [{ $size: "$recipeSelection" }, 0] }, then: 1, else: 0 } } },
                notChosenRecipes: { $sum: { $cond: { if: { $gt: [{ $size: "$recipeSelection" }, 0] }, then: 0, else: 1 } } },
            });

        return group;
    }

    public async countActiveCustomersByWeek(week: Week): Promise<number> {
        const count = await MongooseOrder.aggregate()
            .project({
                _id: 1,
                customer: 1,
                week: 1,
                state: 1,
            })
            .match({ week: week.id.toString(), state: { $in: ["ORDER_ACTIVE", "ORDER_BILLED"] } })
            .group({ _id: "$customer", activeCustomers: { $sum: 1 } })
            .count("activeCustomers");

        return count[0]?.activeCustomers ?? 0;
    }

    public async getBilledAmountSumByWeek(week: Week): Promise<number> {
        const aggregateCount = await MongooseOrder.aggregate()
            .project({ price: 1, shippingDate: 1, state: 1, discountAmount: 1, plan: 1, week: 1 })
            .lookup({ from: "Plan", localField: "plan", foreignField: "_id", as: "plan" })
            .unwind("plan")
            .addFields({ planType: "$plan.type" })
            .match({ week: week.id.toString(), state: { $in: ["ORDER_ACTIVE", "ORDER_BILLED"] } })
            .group({ _id: null, billedAmount: { $sum: "$price" } });

        return aggregateCount[0]?.billedAmount ?? 0;
    }

    public async getBilledAmountAvgByWeek(week: Week): Promise<number> {
        const aggregateCount = await MongooseOrder.aggregate()
            .project({ price: 1, shippingDate: 1, state: 1, discountAmount: 1, plan: 1, week: 1 })
            .match({ week: week.id.toString(), state: "ORDER_BILLED" })
            .lookup({ from: "Plan", localField: "plan", foreignField: "_id", as: "plan" })
            .unwind("plan")
            .addFields({ planType: "$plan.type" })
            .match({ planType: "Principal" })
            .group({ _id: null, billedAmount: { $avg: "$price" } });

        return aggregateCount[0]?.billedAmount ?? 0;
    }

    public async getNumberOfPersonsByWeek(week: Week): Promise<number> {
        const aggregateSum = await MongooseOrder.aggregate()
            .project({ price: 1, shippingDate: 1, state: 1, discountAmount: 1, plan: 1, planVariant: 1, week: 1 })
            .match({ week: week.id.toString(), state: { $in: ["ORDER_ACTIVE", "ORDER_BILLED"] } })
            .lookup({ from: "Plan", localField: "plan", foreignField: "_id", as: "plan" })
            .unwind("$plan")
            .addFields({
                planType: "$plan.type",
                variant: {
                    $reduce: {
                        input: "$plan.variants",
                        in: { $cond: { if: { $eq: ["$$this._id", "$planVariant"] }, then: "$$this", else: "$$value" } },
                        initialValue: { numberOfPersons: 0 },
                    },
                },
            })
            .group({
                _id: null,
                numberOfPersons: {
                    $sum: { $multiply: [{ $ifNull: ["$variant.numberOfPersons", 0] }, { $ifNull: ["$variant.numberOfRecipes", 0] }] },
                },
            });

        return aggregateSum[0]?.numberOfPersons ?? 0;
    }

    public async getCountByPaymentOrderIdMap(
        paymentOrdersIds: PaymentOrderId[],
        locale: Locale = Locale.es
    ): Promise<{ [key: string]: number }> {
        const map: { [key: string]: number } = {};
        const ordersDb = await MongooseOrder.find({ paymentOrder: paymentOrdersIds.map((id) => id.value), deletionFlag: false });

        for (let orderDb of ordersDb) {
            map[orderDb.paymentOrder!] = map[orderDb.paymentOrder!] ? map[orderDb.paymentOrder!] + 1 : 1;
        }

        return map;
    }

    public async getFirstOrderOfSubscription(subscriptionId: SubscriptionId, locale: Locale = Locale.es): Promise<Order | undefined> {
        const orderDb = await MongooseOrder.findOne({ subscription: subscriptionId.value })
            .sort({ shippingDate: 1 })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            });

        return orderDb ? orderMapper.toDomain(orderDb, locale) : undefined;
    }

    public async findByPaymentOrderId(paymentOrderId: PaymentOrderId, locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrderId.value }, locale);
    }

    public async findByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[], locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrdersIds.map((id) => id.value) }, locale);
    }

    public async findActiveOrdersByPaymentOrderId(paymentOrderId: PaymentOrderId, locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrderId.value, state: "ORDER_ACTIVE" }, locale);
    }

    public async findACtiveOrdersByPaymentOrderIdList(paymentOrdersIds: PaymentOrderId[], locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ paymentOrder: paymentOrdersIds.map((id) => id.value), state: "ORDER_ACTIVE" }, locale);
    }

    public async findByChosenRecipeAndFutureShippingDate(recipeId: string): Promise<Order[]> {
        return await this.findBy({ "recipeSelection.recipe": recipeId, shippingDate: { $gte: new Date() } });
    }

    public async findById(orderId: OrderId, locale: Locale): Promise<Order | undefined> {
        const orderDb = await MongooseOrder.findById(orderId.value, { deletionFlag: false })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            });

        return orderDb ? orderMapper.toDomain(orderDb, locale) : undefined;
    }

    public async findByIdOrThrow(orderId: OrderId, locale: Locale = Locale.es): Promise<Order> {
        const order: Order | undefined = await this.findById(orderId, locale);

        if (!!!order) throw new Error("La orden ingresada no existe");

        return order;
    }

    public async findForBilling(subscriptionsIds: SubscriptionId[], week: Week, locale: Locale = Locale.es): Promise<Order[]> {
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
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            });

        return ordersDb.map((order: any) => orderMapper.toDomain(order, locale));
    }

    public async findAll(locale: Locale): Promise<Order[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale: Locale = Locale.es, sort: { [field: string]: 'asc' | 'desc', } | string = ""): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false })
            .sort(sort)
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            })

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    private async findByLimited(conditions: any, locale: Locale = Locale.es): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ ...conditions, deletionFlag: false, shippingDate: { $gte: new Date() } })
            .sort({ shippingDate: 1 })
            // .limit(12)
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    public async findByIdList(ordersIds: OrderId[], locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ _id: ordersIds.map((id) => id.value) }, locale);
    }

    public async findFutureActiveAndSkippedBySubscriptionOrderdByShippingDate(
        subscriptionId: SubscriptionId,
        locale: Locale
    ): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({
            subscription: subscriptionId.value,
            deletionFlag: false,
            shippingDate: { $gte: new Date() },
            state: ["ORDER_ACTIVE", "ORDER_SKIPPED"],
        })
            .sort({ shippingDate: 1 })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    public async findNextTwelveBySubscription(subscriptionId: SubscriptionId, locale: Locale = Locale.es): Promise<Order[]> {
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
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            });

        return ordersDb.map((raw: any) => orderMapper.toDomain(raw, locale));
    }

    public async findActiveBySubscriptionIdList(subscriptionsIds: SubscriptionId[]): Promise<Order[]> {
        return await this.findBy({
            $and: [
                { subscription: subscriptionsIds.map((id) => id.toString()) },
                { state: ["ORDER_ACTIVE", "ORDER_SKIPPED"] },
                { billingDate: { $gt: new Date() } },
            ],
        }, undefined, { billingDate: 'asc' });
    }

    public async findNextTwelveBySubscriptionList(subscriptionsIds: SubscriptionId[], locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findByLimited({ subscription: { $in: subscriptionsIds.map((id) => id.value) } }, locale);
    }

    public async findByWeek(weekId: WeekId, locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ week: weekId.value }, locale);
    }

    public async findPastOrdersBySubscriptionIdList(subscriptionsIds: SubscriptionId[], locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy(
            {
                state: "ORDER_BILLED",
                subscription: subscriptionsIds.map((id) => id.value),
                shippingDate: { $lte: new Date() },
            },
            locale
        );
    }

    public async findByWeekList(weeksIds: WeekId[], locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ week: weeksIds.map((id) => id.value) }, locale);
    }

    public async findByBillingDates(billingDates: Date[], locale: Locale = Locale.es): Promise<Order[]> {
        billingDates.forEach((date) => date.setHours(0, 0, 0, 0));
        return await this.findBy({ billingDate: billingDates }, locale);
    }

    public async findByShippingDates(shippingDates: Date[], locale: Locale = Locale.es): Promise<Order[]> {
        shippingDates.forEach((date) => date.setHours(0, 0, 0, 0));
        return await this.findBy({ shippingDate: shippingDates }, locale);
    }

    public async findCurrentWeekOrders(locale: Locale = Locale.es): Promise<Order[]> {
        const today = new Date();
        const thisWeekMinDay = new Date();
        const thisWeekMaxDay = new Date();

        thisWeekMinDay.setDate(thisWeekMinDay.getDate() + (0 - today.getDay()));
        thisWeekMaxDay.setDate(thisWeekMaxDay.getDate() + (6 - today.getDay()));

        return await this.findBy({ shippingDate: { $gte: thisWeekMinDay, $lte: thisWeekMaxDay } }, locale);
    }

    public async findAllByCustomersIds(customersIds: CustomerId[], locale: Locale = Locale.es): Promise<Order[]> {
        const ordersDb = await MongooseOrder.find({ customer: customersIds.map((id) => id.value), deletionFlag: false })
            .populate("customer")
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("week")
            .populate({
                path: "recipeSelection",
                populate: {
                    path: "recipe",
                    populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
                },
            });

        return ordersDb.map((order: any) => orderMapper.toDomain(order, locale));
    }

    public async findFutureOrders(locale: Locale = Locale.es): Promise<Order[]> {
        return await this.findBy({ shippingDate: { $gt: new Date() } }, locale);
    }

    public async findAllBySubscriptionId(subscriptionId: SubscriptionId): Promise<Order[]> {
        return await this.findBy({ subscription: subscriptionId.toString() });
    }

    public async findOneTimeSubscriptionAndFutureOrders(locale: Locale): Promise<Order[]> {
        return await this.findBy(
            { shippingDate: { $gte: new Date() }, state: "ORDER_BILLED", "subscription.frequency": "one_time" },
            locale
        );
    }

    public async findFutureOrdersByShippingDayOfWeek(shippingDay: Day, locale: Locale = Locale.es): Promise<Order[]> {
        const ordersDb = await MongooseOrder.aggregate([
            {
                $project: {
                    shippingDate: 1,
                    plan: 1,
                    planVariant: 1,
                    state: 1,
                    billingDate: 1,
                    week: 1,
                    price: 1,
                    discountAmount: 1,
                    hasFreeShipping: 1,
                    subscription: 1,
                    recipeVariants: 1,
                    recipeSelection: 1,
                    choseByAdmin: 1,
                    firstDateOfRecipesSelection: 1,
                    lastDateOfRecipesSelection: 1,
                    paymentOrder: 1,
                    _id: 1,
                    customer: 1,
                    isFirstOrderOfSubscription: 1,
                    shippingDayOfWeek: {
                        $dayOfWeek: "$shippingDate",
                    },
                },
            },
            {
                $match: {
                    shippingDayOfWeek: 3,
                    _id: "c1736b79-b097-4fa2-bf38-ba4b70eefb81",
                },
            },
            {
                $lookup: {
                    from: "Customer",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customer",
                },
            },
            {
                $unwind: {
                    path: "$customer",
                    includeArrayIndex: "_id",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "Plan",
                    localField: "plan",
                    foreignField: "_id",
                    as: "plan",
                },
            },
            {
                $unwind: {
                    path: "$plan",
                    includeArrayIndex: "_id",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "Plan",
                    localField: "plan.additionalPlans",
                    foreignField: "_id",
                    as: "plan.additionalPlans",
                },
            },
            {
                $lookup: {
                    from: "Recipe",
                    localField: "recipeSelection.recipe",
                    foreignField: "_id",
                    as: "recipeSelection.recipe",
                },
            },
            {
                $unwind: {
                    path: "$recipeSelection.recipe",
                },
            },
            {
                $lookup: {
                    from: "RecipeVariantRestriction",
                    localField: "recipeSelection.recipe.recipeVariants.restriction",
                    foreignField: "_id",
                    as: "recipeSelection.recipe.recipeVariants.restriction",
                },
            },
            {
                $lookup: {
                    from: "Week",
                    localField: "week",
                    foreignField: "_id",
                    as: "week",
                },
            },
            {
                $unwind: {
                    path: "$week",
                },
            },
        ]);

        return ordersDb.map((orderDb: any) => orderMapper.toDomain(orderDb, locale));
    }

    public async addCustomerToOrderOfSubscription(subscriptionId: SubscriptionId, customerId: CustomerId): Promise<void> {
        await MongooseOrder.updateMany({ subscription: subscriptionId.value }, { customer: customerId.value });
    }

    public async delete(orderId: OrderId): Promise<void> {
        await MongooseOrder.updateOne({ _id: orderId.value }, { deletionFlag: true });
    }

    public async markAsDeletedBySubscriptionId(subscriptionId: SubscriptionId): Promise<void> {
        await MongooseOrder.updateMany({ subscription: subscriptionId.value }, { deletionFlag: true });
    }

    public async destroyManyBySubscriptionId(subscriptionId: SubscriptionId): Promise<void> {
        await MongooseOrder.deleteMany({ subscription: subscriptionId.value });
    }

    public async destroyByCustomerId(customerId: CustomerId): Promise<void> {
        await MongooseOrder.deleteMany({ customer: customerId.toString() })
    }
}

// /**
//  * newField: The new field name.
//  * expression: The new field expression.
//  */
//  {
//     numberOfPersons: {$filter: {input: "$plan.variants", as: "variant", cond: {$eq: ["$planVariant", {$getField: {field: "_id", input: "variant"}}]}}}
// }
