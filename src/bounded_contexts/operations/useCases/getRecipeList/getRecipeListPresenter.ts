import { s3Service } from "../../application/storageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { PlanId } from "../../domain/plan/PlanId";
import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";

export class GetRecipeListPresenter {
    public static async present(recipes: Recipe[]): Promise<any> {
        const presentedRecipes = [];

        for (let recipe of recipes) {
            presentedRecipes.push({
                id: recipe.id.value,
                name: recipe.recipeGeneralData.name,
                sku: recipe.recipeGeneralData.recipeSku.code,
                shortDescription: recipe.recipeGeneralData.recipeDescription.shortDescription,
                longDescription: recipe.recipeGeneralData.recipeDescription.longDescription,
                cookDuration: recipe.recipeGeneralData.cookDuration.value(),
                cookDurationNumberValue: recipe.recipeGeneralData.cookDuration.timeValue,
                difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
                imageUrl: recipe.recipeGeneralData.imageUrl
                    ? await s3Service.getPresignedUrlForFile(recipe.recipeGeneralData.imageUrl)
                    : "",
                weight: recipe.recipeGeneralData.recipeWeight.value(),
                weightNumberValue: recipe.recipeGeneralData.recipeWeight.weightValue,
                backOfficeTags: recipe.recipeBackOfficeTags.map((tag) => tag.name),
                imageTags: recipe.recipeImageTags.map((tag) => tag.name),
                availableWeeks: recipe.availableWeeks.map((week: Week) => {
                    return {
                        id: week.id.value,
                        label: week.getShorterLabel(),
                    };
                }),
                availableMonths: recipe.availableMonths,
                relatedPlans: recipe.relatedPlans.map((planId: PlanId) => planId.value),
                tools: recipe.recipeTools,
                nutritionalInfo: recipe.getPresentedNutritionalInfo(),
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
            });
        }
        return presentedRecipes;
    }
}
