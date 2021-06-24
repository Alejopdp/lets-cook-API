import { Plan } from "../../domain/plan/Plan";

export class GetAdditionalPlanListPresenter {
    public static present(additionalPlans: Plan[]): any {
        const presentedPlans = [];

        for (let plan of additionalPlans) {
            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
                description: plan.description,
                type: plan.type,
                availableFrequencies: plan.availablePlanFrecuencies,
                hasRecipes: plan.hasRecipes,
                imageUrl: plan.imageUrl,
                isActive: plan.isActive,
                sku: plan.planSku.code,
            });
        }

        return presentedPlans;
    }
}
