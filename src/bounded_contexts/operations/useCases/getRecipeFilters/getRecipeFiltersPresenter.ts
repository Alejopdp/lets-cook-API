import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Plan } from "../../domain/plan/Plan";
import { RecipeTag } from "../../domain/recipe/RecipeTag";
import { Week } from "../../domain/week/Week";

export class GetRecipeFiltersPresenter {
    public static present(weeks: Week[], plans: Plan[], backOfficeTags: RecipeTag[]): any {
        const presentedWeeks = [];
        const presentedPlans = [];
        const presentedBackOfficeTags = [];

        for (let week of weeks) {
            presentedWeeks.push({
                id: week.id.value,
                label: `${MomentTimeService.getNumberOfDayInMonth(week.minDay)}-${MomentTimeService.getNumberOfDayInMonth(
                    week.maxDay
                )} ${MomentTimeService.getShortenedMonthName(week.minDay)}`,
            });
        }

        for (let plan of plans) {
            presentedPlans.push({
                id: plan.id.value,
                description: plan.description,
            });
        }

        for (let tag of backOfficeTags) {
            presentedBackOfficeTags.push(tag.name);
        }

        return { weeks: presentedWeeks, plans: presentedPlans, tags: presentedBackOfficeTags };
    }
}
