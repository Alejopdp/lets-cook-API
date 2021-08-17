import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";

export class GetRecipeByIdPresenter {
    public static present(recipe: Recipe): any {
        return {
            id: recipe.id.value,
            name: recipe.recipeGeneralData.name,
            sku: recipe.recipeGeneralData.recipeSku.code,
            shortDescription: recipe.recipeGeneralData.recipeDescription.shortDescription,
            longDescription: recipe.recipeGeneralData.recipeDescription.longDescription,
            cookDuration: recipe.recipeGeneralData.cookDuration.value(),
            cookDurationNumberValue: recipe.recipeGeneralData.cookDuration.timeValue,
            nutritionalInfo: recipe.getPresentedNutritionalInfo(),
            difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
            imageUrl: recipe.recipeGeneralData.imageUrl,
            weight: recipe.recipeGeneralData.recipeWeight.value(),
            weightNumberValue: recipe.recipeGeneralData.recipeWeight.weightValue,
            backOfficeTags: recipe.recipeBackOfficeTags.map((tag) => tag.name),
            imageTags: recipe.recipeImageTags.map((tag) => tag.name),
            tools: recipe.recipeTools,
            availableWeeks: recipe.availableWeeks.map((week: Week) => {
                return {
                    id: week.id.value,
                    label: `${MomentTimeService.getNumberOfDayInMonth(week.minDay)}-${MomentTimeService.getNumberOfDayInMonth(
                        week.maxDay
                    )} ${MomentTimeService.getShortenedMonthName(week.minDay)}`,
                };
            }),
            availableMonths: recipe.availableMonths,
            relatedPlans: recipe.relatedPlans.map((planId) => planId.value),
            recipeVariants: recipe.recipeVariants.map((variant) => {
                return {
                    ingredients: variant.ingredients.map((ing) => ing.name),
                    restriction: {
                        id: variant.restriction.id.value,
                        value: variant.restriction.value,
                        label: variant.restriction.label,
                    },
                    sku: variant.sku.code,
                };
            }),
        };
    }
}
