import { v3S3Service } from "../../application/storageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { PlanId } from "../../domain/plan/PlanId";
import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";

export class GetActualWeekRecipesPresenter {
    public async present(recipes: Recipe[]): Promise<any> {
        const presentedRecipes = [];

        for (let recipe of recipes) {
            const recipeUrl = recipe.getMainImageUrl() ? await v3S3Service.getPresignedUrlForFile(recipe.getMainImageUrl()) : "";

            const recipeImages: string[] = [];

            for (let imageUrl of recipe.getImagesUrls()) {
                const presignedUrl = await v3S3Service.getPresignedUrlForFile(imageUrl);
                recipeImages.push(presignedUrl);
            }

            presentedRecipes.push({
                id: recipe.id.value,
                name: recipe.recipeGeneralData.name,
                sku: recipe.recipeGeneralData.recipeSku.code,
                shortDescription: recipe.recipeGeneralData.recipeDescription.shortDescription,
                longDescription: recipe.recipeGeneralData.recipeDescription.longDescription,
                cookDuration: recipe.recipeGeneralData.cookDuration.value(),
                cookDurationNumberValue: recipe.recipeGeneralData.cookDuration.timeValue,
                difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
                orderPriority: recipe.orderPriority,
                imageUrl: recipeUrl,
                imagesUrls: recipeImages,
                weight: recipe.recipeGeneralData.recipeWeight.value(),
                weightNumberValue: recipe.recipeGeneralData.recipeWeight.weightValue,
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
                nutritionalInfo: recipe.recipeNutritionalData.nutritionalItems.map((item) => ({
                    key: item.key,
                    value: item.value,
                })),

                availableMonths: recipe.availableMonths,
                relatedPlans: recipe.relatedPlans.map((planId: PlanId) => planId.value),
                tools: recipe.recipeTools,
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
        return presentedRecipes.sort((r1, r2) => r1.orderPriority! - r2.orderPriority!);
    }
}
