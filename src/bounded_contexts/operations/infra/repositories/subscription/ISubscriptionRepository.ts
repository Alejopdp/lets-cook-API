import { QueryOptions } from "mongoose";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Locale } from "../../../domain/locale/Locale";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { Subscription } from "../../../domain/subscription/Subscription";
import { SubscriptionId } from "../../../domain/subscription/SubscriptionId";

export interface ISubscriptionRepository {
    save(subscription: Subscription): Promise<void>;
    bulkSave(subscriptions: Subscription[]): Promise<void>;
    saveCancelledSubscriptions(subscriptions: Subscription[]): Promise<void>;
    findAll(locale: Locale): Promise<Subscription[]>;
    findById(subscriptionId: SubscriptionId, locale?: Locale): Promise<Subscription | undefined>;
    findByIdOrThrow(subscriptionId: SubscriptionId, locale?: Locale): Promise<Subscription>;
    findBy(conditions: any, locale: Locale, options?: QueryOptions): Promise<Subscription[]>;
    findByIdList(subscriptionsIds: SubscriptionId[]): Promise<Subscription[]>;
    findByCustomerId(customerId: CustomerId): Promise<Subscription[]>;
    findActiveSubscriptionByPlanVariantsIds(planVariantsIds: PlanVariantId[]): Promise<Subscription[]>;
    findActiveSusbcriptionsByCustomerId(customerId: CustomerId): Promise<Subscription[]>;
    findActiveSusbcriptionsByCustomerIdList(customersIds: CustomerId[]): Promise<Subscription[]>;
    delete(subscriptionId: SubscriptionId): Promise<void>;
}
