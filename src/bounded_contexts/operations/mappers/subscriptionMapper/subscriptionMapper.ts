import { Mapper } from "../../../../core/infra/Mapper";
import { Subscription } from "../../domain/subscription/Subscription";
import { Locale } from "../../domain/locale/Locale";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { SubscriptionStateFactory } from "../../domain/subscription/subscriptionState/SubscriptionStateFactory";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";

export class SubscriptionMapper implements Mapper<Subscription> {
    public toDomain(raw: any, locale?: Locale): Subscription {
        const frequency: PlanFrequency = (<any>PlanFrequency)[raw.frequency];

        return new Subscription(
            raw.PlanVariant,
            frequency,
            SubscriptionStateFactory.createState(raw.state),
            raw.Restrictions,
            raw.restrictionComment,
            raw.createdAt,
            raw.couponChargesQtyApplied,
            raw.billingStartDate,
            raw.cancellationReason,
            new SubscriptionId(raw._id)
        );
    }

    public toPersistence(t: Subscription, locale?: Locale) {
        return {
            planVariantId: t.planVariant.id.value,
            frequency: t.frequency,
            state: t.state.title,
            restrictions: t.restrictions.map((restriction) => restriction.id.value),
            restrictionComment: t.restrictionComment,
            couponChargesQtyApplied: t.couponChargesQtyApplied,
            billingStartDate: t.billingStartDate,
            cancellationReason: t.cancellationReason, // Separate attributes
        };
    }
}
