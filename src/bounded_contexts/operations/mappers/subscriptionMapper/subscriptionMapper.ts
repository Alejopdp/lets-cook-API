import { Mapper } from "../../../../core/infra/Mapper";
import { Subscription } from "../../domain/subscription/Subscription";
import { Locale } from "../../domain/locale/Locale";
import { SubscriptionStateFactory } from "../../domain/subscription/subscriptionState/SubscriptionStateFactory";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { planMapper, recipeRestrictionMapper } from "..";
import { customerMapper } from "../customerMapper";
import { Customer } from "../../domain/customer/Customer";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";
import { PlanFrequencyFactory } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";
import { IPlanFrequency } from "../../domain/plan/PlanFrequency/IPlanFrequency";
import { couponMapper } from "../couponMapper";
import { Coupon } from "../../domain/cupons/Cupon";

export class SubscriptionMapper implements Mapper<Subscription, any> {
    public toDomain(raw: any, locale?: Locale): Subscription {
        const frequency: IPlanFrequency = PlanFrequencyFactory.createPlanFrequency(raw.frequency);
        const restriction: RecipeVariantRestriction | undefined = !!raw.restriction
            ? recipeRestrictionMapper.toDomain(raw.restriction)
            : undefined;
        const customer: Customer = customerMapper.toDomain(raw.customer);
        const planVariantId: PlanVariantId = new PlanVariantId(raw.planVariant);
        const plan: Plan = planMapper.toDomain(raw.plan, locale || Locale.es);
        const coupon: Coupon | undefined = !!raw.coupon ? couponMapper.toDomain(raw.coupon) : undefined;
        const cancellation: CancellationReason | undefined = raw.cancellation
            ? new CancellationReason(
                raw.cancellation.reason,
                raw.cancellation.cancelledBy ?? "",
                raw.cancellation.comment,
                new Date(raw.cancellation.date)
            )
            : undefined;

        return new Subscription(
            planVariantId,
            plan,
            frequency,
            SubscriptionStateFactory.createState(raw.state),
            raw.restrictionComment,
            raw.createdAt,
            customer,
            raw.price / 100,
            restriction,
            coupon,
            raw.couponChargesQtyApplied,
            raw.billingDayOfWeek,
            raw.billingStartDate,
            cancellation,
            new SubscriptionId(raw._id)
        );
    }

    public toPersistence(t: Subscription, locale?: Locale) {
        const cancellation = !!t.cancellationReason
            ? {
                reason: t.cancellationReason.title,
                cancelledBy: t.cancellationReason.cancelledBy ?? "",
                comment: t.cancellationReason.comment,
                date: t.cancellationReason.date,
            }
            : null;

        return {
            planVariant: t.planVariantId.value,
            plan: t.plan.id.value,
            frequency: t.frequency.value(),
            state: t.state.title,
            restriction: !!t.restriction ? t.restriction.id.value : null,
            restrictionComment: t.restrictionComment,
            couponChargesQtyApplied: t.couponChargesQtyApplied,
            customer: t.customer.id.value,
            coupon: t.coupon ? t.coupon.id.value : null,
            billingDayOfWeek: t.billingDayOfWeek,
            billingStartDate: t.billingStartDate,
            cancellation,
            _id: t.id.value,
            price: Math.round(t.price * 100),
        };
    }
}
