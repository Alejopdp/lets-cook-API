import { Mapper } from "../../../../core/infra/Mapper";
import { Subscription } from "../../domain/subscription/Subscription";
import { Locale } from "../../domain/locale/Locale";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { SubscriptionStateFactory } from "../../domain/subscription/subscriptionState/SubscriptionStateFactory";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { planMapper, recipeRestrictionMapper } from "..";
import { CustomerId } from "../../domain/customer/CustomerId";
import { CouponId } from "../../domain/cupons/CouponId";
import { customerMapper } from "../customerMapper";
import { Customer } from "../../domain/customer/Customer";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { logger } from "../../../../../config";
import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";

export class SubscriptionMapper implements Mapper<Subscription> {
    public toDomain(raw: any, locale?: Locale): Subscription {
        const frequency: PlanFrequency = (<any>PlanFrequency)[raw.frequency];
        const restriction: RecipeVariantRestriction | undefined = !!raw.restriction
            ? recipeRestrictionMapper.toDomain(raw.restriction)
            : undefined;
        const customer: Customer = customerMapper.toDomain(raw.customer);
        const planVariantId: PlanVariantId = new PlanVariantId(raw.planVariant);
        const plan: Plan = planMapper.toDomain(raw.plan, locale || Locale.es);
        const couponId: CouponId | undefined = !!raw.coupon ? new CouponId(raw.coupon) : undefined;
        const cancellation: CancellationReason | undefined = raw.cancellation
            ? new CancellationReason(raw.cancellation.reason, raw.cancellation.comment)
            : undefined;

        return new Subscription(
            planVariantId,
            plan,
            frequency,
            SubscriptionStateFactory.createState(raw.state),
            raw.restrictionComment,
            raw.createdAt,
            customer,
            raw.price,
            restriction,
            couponId,
            raw.couponChargesQtyApplied,
            raw.billingDayOfWeek,
            raw.billingStartDate,
            cancellation,
            new SubscriptionId(raw._id)
        );
    }

    public toPersistence(t: Subscription, locale?: Locale) {
        const cancellation = !!t.cancellationReason ? { reason: t.cancellationReason.title, comment: t.cancellationReason.comment } : null;
        return {
            planVariant: t.planVariantId.value,
            plan: t.plan.id.value,
            frequency: t.frequency,
            state: t.state.title,
            restrictions: !!t.restriction ? t.restriction.id.value : null,
            restrictionComment: t.restrictionComment,
            couponChargesQtyApplied: t.couponChargesQtyApplied,
            customer: t.customer.id.value,
            coupon: t.couponId ? t.couponId.value : null,
            billingDayOfWeek: t.billingDayOfWeek,
            billingStartDate: t.billingStartDate,
            cancellation,
            _id: t.id.value,
            price: t.price,
        };
    }
}
