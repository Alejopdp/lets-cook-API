import { Subscription } from "../../../domain/subscription/Subscription";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";
import { ISubscriptionRepository } from "./ISubscriptionRepository";
import { Subscription as MongooseSubscription } from "../../../../../infraestructure/mongoose/models";
import { subscriptionMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Query, QueryOptions } from "mongoose";

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

    public async findById(subscriptionId: SubscriptionId, locale: Locale = Locale.es): Promise<Subscription | undefined> {
        const subscriptionDb = await MongooseSubscription.findById(subscriptionId.value, { deletionFlag: false })
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("customer")
            .populate("restriction");

        return subscriptionDb ? subscriptionMapper.toDomain(subscriptionDb) : undefined;
    }

    public async findByIdList(subscriptionsIds: SubscriptionId[]): Promise<Subscription[]> {
        return await this.findBy({ _id: subscriptionsIds.map((id) => id.value) });
    }

    public async findByIdOrThrow(subscriptionId: SubscriptionId): Promise<Subscription> {
        const subscription = await this.findById(subscriptionId);
        if (!!!subscription) throw new Error("La suscripción ingresada no existe");

        return subscription;
    }

    public async findAll(locale: Locale): Promise<Subscription[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale: Locale = Locale.es, options?: QueryOptions): Promise<Subscription[]> {
        const subscriptionsDb = await MongooseSubscription.find({ ...conditions, deletionFlag: false }, null, options)
            .populate({ path: "plan", populate: { path: "additionalPlans" } })
            .populate("customer")
            .populate("restriction");

        return subscriptionsDb.map((raw: any) => subscriptionMapper.toDomain(raw, locale));
    }

    public async findActiveSusbcriptionsByCustomerId(customerId: CustomerId, locale?: Locale): Promise<Subscription[]> {
        return await this.findBy({ customer: customerId.value, state: "SUBSCRIPTION_ACTIVE" }, Locale.es);
    }

    public async findActiveSusbcriptionsByCustomerIdList(customersIds: CustomerId[]): Promise<Subscription[]> {
        return await this.findBy({ customer: customersIds.map((id) => id.value), state: "SUBSCRIPTION_ACTIVE" }, Locale.es);
    }

    public async findByCustomerId(customerId: CustomerId): Promise<Subscription[]> {
        const options: QueryOptions = {
            sort: {
                state: 1,
            },
        };
        return await this.findBy({ customer: customerId.value }, Locale.es, options);
    }

    public async delete(subscriptionId: SubscriptionId): Promise<void> {
        await MongooseSubscription.updateOne({ _id: subscriptionId.value }, { deletionFlag: true });
    }
}
