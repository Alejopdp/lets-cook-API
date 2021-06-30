import { Plan } from "../../domain/plan/Plan";

export class GetDataForSwappingAPlanPresenter {
    public present(plans: Plan[]): any {
        const presentedPlans = [];
        const presentedVariants = [];

        for (let plan of plans) {
            presentedPlans.push({
                planId: plan.id.value,
                name: plan.name,
                active: plan.isActive,
            });

            for (let variant of plan.planVariants) {
                presentedVariants.push({
                    planId: plan.id.value,
                    planVariantId: variant.id.value,
                    variantDescription: plan.getPlanVariantLabelWithPrice(variant.id),
                    active: plan.isActive,
                });
            }
        }

        return { plans: presentedPlans, variants: presentedVariants };
    }
}
