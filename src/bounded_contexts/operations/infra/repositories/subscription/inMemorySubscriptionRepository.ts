import { CouponId } from "@src/bounded_contexts/operations/domain/cupons/CouponId";
import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Subscription } from "@src/bounded_contexts/operations/domain/subscription/Subscription";
import { SubscriptionId } from "@src/bounded_contexts/operations/domain/subscription/SubscriptionId";
import { ISubscriptionRepository } from "./ISubscriptionRepository";
import { Week } from "@src/bounded_contexts/operations/domain/week/Week";

export class InMemorySusbcriptionRepository implements ISubscriptionRepository {
    private subscriptions: Subscription[] = [];

    public constructor(subscriptions: Subscription[]) {
        this.subscriptions = subscriptions;
    }

    public async save(subscription: Subscription): Promise<void> {
        // If subscription exists update it in the same order. If not, push it to the array
        const subscriptionIndex = this.subscriptions.findIndex((s) => s.id.equals(subscription.id));
        if (subscriptionIndex !== -1) {
            this.subscriptions[subscriptionIndex] = subscription;
            return;
        }
        else {
            this.subscriptions.push(subscription);
            return;
        }

    }

    public async bulkSave(subscriptions: Subscription[]): Promise<void> {
        this.subscriptions = this.subscriptions.concat(subscriptions);
    }

    public async saveCancelledSubscriptions(subscriptions: Subscription[]): Promise<void> {
        this.subscriptions = this.subscriptions.concat(subscriptions);
    }

    public async countCancelledSubscriptionsByWeek(week: Week): Promise<number> {
        return 1
    }

    public async findAll(locale: any): Promise<any[]> {
        return this.subscriptions;
    }

    public async findById(subscriptionId: SubscriptionId, locale: any): Promise<any | undefined> {
        return this.subscriptions.find((subscription) => subscription.id.equals(subscriptionId));
    }

    public async findByIdOrThrow(subscriptionId: SubscriptionId, locale: any): Promise<any> {
        const subscription = await this.findById(subscriptionId, locale);
        if (!subscription) {
            throw new Error("Subscription not found");
        }
        return subscription;
    }

    public async findBy(conditions: any, locale: any, options?: any): Promise<any[]> {
        return this.subscriptions.filter((subscription: Subscription) => {
            let match = true;
            for (const key in conditions) {
                //@ts-ignore
                if (subscription[key] !== conditions[key]) {
                    match = false;
                    break;
                }
            }
            return match;
        });
    }

    public async findByIdList(subscriptionsIds: any[]): Promise<any[]> {
        return this.subscriptions.filter((subscription) => subscriptionsIds.includes(subscription.id));
    }

    public async findByCustomerId(customerId: CustomerId, locale: any): Promise<Subscription[]> {
        return this.subscriptions.filter((subscription) => subscription.customer.id.equals(customerId));
    }

    public async findActiveSubscriptionByPlanVariantsIds(planVariantsIds: any[]): Promise<any[]> {
        return this.subscriptions.filter((subscription) => planVariantsIds.includes(subscription.planVariantId));
    }

    public async findActiveSusbcriptionsByCustomerId(customerId: CustomerId): Promise<any[]> {
        return this.subscriptions.filter((subscription) => subscription.customer.id.equals(customerId));
    }

    public async findActiveSusbcriptionsByCustomerIdList(customersIds: CustomerId[]): Promise<any[]> {
        return []

    }


    findAllCancelledSubscriptions(): Promise<Subscription[]> {
        throw new Error("Method not implemented.");
    }
    findByCouponId(couponId: CouponId): Promise<Subscription[]> {
        throw new Error("Method not implemented.");
    }
    delete(subscriptionId: SubscriptionId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    destroy(subscriptionId: SubscriptionId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    destroyManyByCustomer(customerId: CustomerId): Promise<void> {
        throw new Error("Method not implemented.");
    }


}