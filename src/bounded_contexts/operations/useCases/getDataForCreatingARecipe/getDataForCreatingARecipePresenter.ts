import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Ingredient } from "../../domain/ingredient/ingredient";
import { Plan } from "../../domain/plan/Plan";
import { Month } from "../../domain/recipe/Months";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { Week } from "../../domain/week/Week";

export class GetDataForCreatingARecipePresenter {
    public static present(
        plans: Plan[],
        ingredients: Ingredient[],
        weeks: Week[],
        months: Month[],
        restrictions: RecipeVariantRestriction[]
    ): any {
        const presentedPlans = [];
        const presentedIngredients = [];
        const presentedWeeks = [];
        const presentedRestrictions = [];

        for (let plan of plans) {
            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
            });
        }

        for (let ingredient of ingredients) {
            presentedIngredients.push({ name: ingredient.name, id: ingredient.id.toString() });
        }

        for (let week of weeks) {
            presentedWeeks.push({
                id: week.id.value,
                label: `${MomentTimeService.getNumberOfDayInMonth(week.minDay)}-${MomentTimeService.getNumberOfDayInMonth(
                    week.maxDay
                )} ${MomentTimeService.getShortenedMonthName(week.minDay)}`,
            });
        }

        for (let restriction of restrictions) {
            presentedRestrictions.push({
                id: restriction.id.value,
                label: restriction.label,
                value: restriction.value,
            });
        }

        return {
            plans: presentedPlans,
            ingredients: presentedIngredients,
            weeks: presentedWeeks,
            months,
            restrictions: presentedRestrictions,
        };
    }
}
