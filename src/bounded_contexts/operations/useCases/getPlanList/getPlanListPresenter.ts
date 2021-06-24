import { Plan } from "../../domain/plan/Plan";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";

export class GetPlanListPresenter {
    public static present(plans: Plan[]): any {
        const presentedPlans = [];

        for (let plan of plans) {
            var presentedVariants = [];

            for (let variant of plan.planVariants) {
                if (plan.hasRecipes) {
                    presentedVariants.push({
                        id: variant.id.value,
                        sku: variant.sku.code,
                        name: variant.name,
                        price: variant.price,
                        priceWithOffer: variant.priceWithOffer,
                        //@ts-ignore
                        numberOfPersons: variant.numberOfPersons,
                        //@ts-ignore
                        numberOfRecipes: variant.numberOfRecipes,
                        attributes: variant.attributes.map((attr) => [attr.key, attr.value]),
                    });
                } else {
                    presentedVariants.push({
                        id: variant.id.value,
                        sku: variant.sku.code,
                        name: variant.name,
                        price: variant.price,
                        priceWithOffer: variant.priceWithOffer,
                        attributes: variant.attributes.map((attr) => [attr.key, attr.value]),
                    });
                }
            }

            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
                sku: plan.planSku.code,
                description: plan.description,
                availablePlanFrecuencies: plan.availablePlanFrecuencies,
                isActive: plan.isActive,
                type: plan.type,
                imageUrl: plan.imageUrl,
                hasRecipes: plan.hasRecipes,
                variants: presentedVariants,
                additionalPlans: plan.additionalPlans.map((plan: Plan) => plan.id.value),
            });
        }

        return presentedPlans;
    }
}
