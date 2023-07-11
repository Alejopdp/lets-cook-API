import { Subscription } from "../../../domain/subscription/Subscription";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";
import { ISubscriptionRepository } from "./ISubscriptionRepository";
import { Subscription as MongooseSubscription } from "../../../../../infraestructure/mongoose/models";
import { subscriptionMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Query, QueryOptions } from "mongoose";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { CouponId } from "../../../domain/cupons/CouponId";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";

export class MongooseSubscriptionRepository implements ISubscriptionRepository {
    public async save(subscription: Subscription): Promise<void> {
        const subscriptionDb = subscriptionMapper.toPersistence(subscription);

        if (await MongooseSubscription.exists({ _id: subscription.id.value })) {
            await MongooseSubscription.updateOne({ _id: subscription.id.value }, subscriptionDb);
        } else {
            await MongooseSubscription.create(subscriptionDb);
        }
    }

    public async bulkSave(subscriptions: Subscription[]): Promise<void> {
        const subscriptionsToSave = subscriptions.map((subscription) => subscriptionMapper.toPersistence(subscription));

        await MongooseSubscription.create(subscriptionsToSave);
    }

    public async saveCancelledSubscriptions(subscriptions: Subscription[]): Promise<void> {
        const subscriptionsToSave = subscriptions.map((subscription) => subscriptionMapper.toPersistence(subscription));

        await MongooseSubscription.updateMany({ _id: subscriptions.map((sub) => sub.id.value) }, { state: "SUBSCRIPTION_CANCELLED" }); // TO DO: Save cancellation reason
    }

    public async countCancelledSubscriptionsByWeek(week: Week): Promise<number> {
        const count = await MongooseSubscription.countDocuments({
            state: "SUBSCRIPTION_CANCELLED",
            "cancellation.date": { $gte: week.minDay, $lte: week.maxDay },
        });
        return count;
    }

    public async findById(subscriptionId: SubscriptionId, locale: Locale = Locale.es): Promise<Subscription | undefined> {
        const subscriptionDb = await MongooseSubscription.findById(subscriptionId.value, { deletionFlag: false })
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("customer")
            .populate("restriction")
            .populate("coupon");

        return subscriptionDb ? subscriptionMapper.toDomain(subscriptionDb, locale) : undefined;
    }

    public async findByIdList(subscriptionsIds: SubscriptionId[]): Promise<Subscription[]> {
        return await this.findBy({ _id: subscriptionsIds.map((id) => id.value) });
    }

    public async findByIdOrThrow(subscriptionId: SubscriptionId, locale: Locale): Promise<Subscription> {
        const subscription = await this.findById(subscriptionId, locale);
        if (!!!subscription) throw new Error("La suscripción ingresada no existe");

        return subscription;
    }

    public async findAll(locale: Locale): Promise<Subscription[]> {
        return await this.findBy({}, locale);
    }

    public async findAllCancelledSubscriptions(): Promise<Subscription[]> {
        return await this.findBy({ state: "SUBSCRIPTION_CANCELLED" }, undefined, { sort: { "cancellation.date": -1 } });
    }

    public async findBy(conditions: any, locale: Locale = Locale.es, options?: QueryOptions): Promise<Subscription[]> {
        const subscriptionsDb = await MongooseSubscription.find({ ...conditions, deletionFlag: false }, null, options)
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("customer")
            .populate("restriction")
            .populate("coupon")
            .lean()

        return subscriptionsDb.map((raw: any) => subscriptionMapper.toDomain(raw, locale));
    }

    public async findActiveSusbcriptionsByCustomerId(customerId: CustomerId, locale?: Locale): Promise<Subscription[]> {
        return await this.findBy({ customer: customerId.value, state: "SUBSCRIPTION_ACTIVE" }, Locale.es);
    }

    public async findActiveSusbcriptionsByCustomerIdList(customersIds: CustomerId[]): Promise<Subscription[]> {
        return await this.findBy({ customer: customersIds.map((id) => id.value), state: "SUBSCRIPTION_ACTIVE" }, Locale.es);
    }

    public async findActiveSubscriptionByPlanVariantsIds(planVariantsIds: PlanVariantId[]): Promise<Subscription[]> {
        return await this.findBy({ planVariant: planVariantsIds.map((id) => id.value), state: "SUBSCRIPTION_ACTIVE" });
    }

    public async findByCustomerId(customerId: CustomerId, locale: Locale): Promise<Subscription[]> {
        const options: QueryOptions = {
            sort: {
                state: 1,
            },
        };
        return await this.findBy({ customer: customerId.value }, locale, options);
    }

    public async findByCouponId(couponId: CouponId): Promise<Subscription[]> {
        return await this.findBy({ coupon: couponId.toString() });
    }

    public async delete(subscriptionId: SubscriptionId): Promise<void> {
        await MongooseSubscription.updateOne({ _id: subscriptionId.value }, { deletionFlag: true });
    }

    public async destroy(subscriptionId: SubscriptionId): Promise<void> {
        await MongooseSubscription.deleteOne({ _id: subscriptionId.value });
    }

    public async destroyManyByCustomer(customerId: CustomerId): Promise<void> {
        await MongooseSubscription.deleteMany({ customer: customerId.toString() })
    }
}
