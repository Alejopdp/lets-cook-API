import { Subscription } from "../../../domain/subscription/Subscription";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";
import { ISubscriptionRepository } from "./ISubscriptionRepository";
import { Subscription as MongooseSubscription } from "../../../../../infraestructure/mongoose/models";
import { subscriptionMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";

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

    public async findById(subscriptionId: SubscriptionId): Promise<Subscription | undefined> {
        const subscriptionDb = await MongooseSubscription.findById(subscriptionId.value, { deletionFlag: false });

        return subscriptionDb ? subscriptionMapper.toDomain(subscriptionDb) : undefined;
    }

    public async findAll(locale: Locale): Promise<Subscription[]> {
        return await this.findBy({}, locale);
    }

    public async findBy(conditions: any, locale: Locale): Promise<Subscription[]> {
        const subscriptionsDb = await MongooseSubscription.find({ ...conditions, deletionFlag: false });

        return subscriptionsDb.map((raw: any) => subscriptionMapper.toDomain(raw, locale));
    }

    public async delete(subscriptionId: SubscriptionId): Promise<void> {
        await MongooseSubscription.updateOne({ _id: subscriptionId.value }, { deletionFlag: true });
    }
}
