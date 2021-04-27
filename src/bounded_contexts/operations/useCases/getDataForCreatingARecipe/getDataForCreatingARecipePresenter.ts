import { Ingredient } from "../../domain/ingredient/ingredient";
import { Plan } from "../../domain/plan/Plan";

export class GetDataForCreatingARecipePresenter {
    public static present(plans: Plan[], ingredients: Ingredient[]): any {
        const presentedPlans = [];
        const presentedIngredients = [];
        const weeks = [
            { id: 1, label: "10-17 Abril" },
            { id: 2, label: "18-23 Abril" },
            { id: 3, label: "26-03 Mayo" },
            { id: 4, label: "04-11 Mayo" },
            { id: 5, label: "12-19 Mayo" },
            { id: 6, label: "20-27 Mayo" },
        ];

        for (let plan of plans) {
            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
            });
        }

        for (let ingredient of ingredients) {
            presentedIngredients.push(ingredient.name);
        }

        return { plans: presentedPlans, ingredients: presentedIngredients, weeks };
    }
}
