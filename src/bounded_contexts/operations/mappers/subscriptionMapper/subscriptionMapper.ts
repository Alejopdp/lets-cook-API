import { Mapper } from "../../../../core/infra/Mapper";
import { Subscription } from "../../domain/subscription/Subscription";
import { Locale } from "../../domain/locale/Locale";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { SubscriptionStateFactory } from "../../domain/subscription/subscriptionState/SubscriptionStateFactory";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { recipeRestrictionMapper } from "..";
import { CustomerId } from "../../domain/customer/CustomerId";
import { CouponId } from "../../domain/cupons/CouponId";

export class SubscriptionMapper implements Mapper<Subscription> {
    public toDomain(raw: any, locale?: Locale): Subscription {
        const frequency: PlanFrequency = (<any>PlanFrequency)[raw.frequency];
        const restrictions: RecipeVariantRestriction[] = raw.Restrictions.map((restriction: any) =>
            recipeRestrictionMapper.toDomain(restriction)
        );

        return new Subscription(
            raw.PlanVariant,
            frequency,
            SubscriptionStateFactory.createState(raw.state),
            restrictions,
            raw.restrictionComment,
            raw.createdAt,
            raw.couponChargesQtyApplied,
            new CustomerId(raw.customer),
            new CouponId(raw.coupon),
            raw.billingDayOfWeek,
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
            customer: t.customerId.value,
            coupon: t.couponId ? t.couponId.value : null,
            billingDayOfWeek: t.billingDayOfWeek,
            billingStartDate: t.billingStartDate,
            cancellationReason: t.cancellationReason, // Separate attributes
            _id: t.id.value,
        };
    }
}
