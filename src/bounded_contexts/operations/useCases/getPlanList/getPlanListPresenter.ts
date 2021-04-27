import { Plan } from "../../domain/plan/Plan";

export class GetPlanListPresenter {
    public static present(plans: Plan[]): any {
        const presentedPlans = [];

        for (let plan of plans) {
            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
                sku: plan.planSku.code,
                description: plan.description,
                availablePlanFrecuencies: plan.availablePlanFrecuencies,
                isActive: plan.isActive,
                type: plan.type,
                imageUrl: plan.imageUrl,
            });
        }

        return presentedPlans;
    }
}
