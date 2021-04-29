import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";

export class GetRecipeListPresenter {
    public static present(recipes: Recipe[]): any {
        const presentedRecipes = [];

        for (let recipe of recipes) {
            presentedRecipes.push({
                id: recipe.id.value,
                name: recipe.recipeGeneralData.name,
                sku: recipe.recipeGeneralData.recipeSku.code,
                shortDescription: recipe.recipeGeneralData.recipeDescription.shortDescription,
                longDescription: recipe.recipeGeneralData.recipeDescription.longDescription,
                cookDuration: recipe.recipeGeneralData.cookDuration.value(),
                difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
                imageUrl: recipe.recipeGeneralData.imageUrl,
                weight: recipe.recipeGeneralData.recipeWeight.value(),
                backOfficeTags: recipe.recipeBackOfficeTags.map((tag) => tag.name),
                imageTags: recipe.recipeImageTags.map((tag) => tag.name),
                availableWeeks: recipe.availableWeeks.map((week: Week) => {
                    return {
                        id: week.id.value,
                        label: `${MomentTimeService.getNumberOfDayInMonth(week.minDay)}-${MomentTimeService.getNumberOfDayInMonth(
                            week.maxDay
                        )} ${MomentTimeService.getShortenedMonthName(week.minDay)}`,
                    };
                }),
                availableMonths: recipe.availableMonths,
            });
        }
        return presentedRecipes;
    }
}
