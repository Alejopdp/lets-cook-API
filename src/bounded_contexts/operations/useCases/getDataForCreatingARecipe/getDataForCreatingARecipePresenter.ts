import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Ingredient } from "../../domain/ingredient/ingredient";
import { Plan } from "../../domain/plan/Plan";
import { Week } from "../../domain/week/Week";

export class GetDataForCreatingARecipePresenter {
    public static present(plans: Plan[], ingredients: Ingredient[], weeks: Week[]): any {
        const presentedPlans = [];
        const presentedIngredients = [];
        const presentedWeeks = [];

        for (let plan of plans) {
            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
            });
        }

        for (let ingredient of ingredients) {
            presentedIngredients.push(ingredient.name);
        }

        for (let week of weeks) {
            presentedWeeks.push({
                id: week.id.value,
                label: `${MomentTimeService.getNumberOfDayInMonth(week.minDay)}-${MomentTimeService.getNumberOfDayInMonth(
                    week.maxDay
                )} ${MomentTimeService.getShortenedMonthName(week.minDay)}`,
            });
        }

        return { plans: presentedPlans, ingredients: presentedIngredients, weeks: presentedWeeks };
    }
}
