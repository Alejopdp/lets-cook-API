import { Plan } from "../../domain/plan/Plan";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetDataForSwappingAPlanPresenter {
    public present(subscription: Subscription, plans: Plan[]): any {
        const presentedPlans = [];
        const presentedVariants = [];

        for (let plan of plans) {
            presentedPlans.push({
                planId: plan.id.value,
                name: plan.name,
                active: subscription.plan.id.equals(plan.id),
            });

            for (let variant of plan.planVariants) {
                presentedVariants.push({
                    planId: plan.id.value,
                    planVariantId: variant.id.value,
                    variantDescription: `${plan.getPlanVariantLabelWithPrice(variant.id)} €/${subscription.frequency}`,
                    active: subscription.planVariantId.equals(variant.id),
                });
            }
        }

        return { plans: presentedPlans, variants: presentedVariants };
    }
}
