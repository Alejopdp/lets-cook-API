import { s3Service } from "../../application/storageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";

export class GetRecipeByIdPresenter {
    public static async present(recipe: Recipe): Promise<any> {
        const imagesUrls: string[] = [];

        for (let imageUrl of recipe.recipeGeneralData.imagesUrls || []) {
            const presignedUrl = await s3Service.getPresignedUrlForFile(imageUrl);

            imagesUrls.push(presignedUrl);
        }

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
            orderPriority: recipe.orderPriority,
            imageUrl:
                Array.isArray(recipe.recipeGeneralData.imagesUrls) && recipe.recipeGeneralData.imagesUrls.length > 0
                    ? recipe.getMainImageUrl()
                    : "",
            imagesUrls,
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
                    rawIngredients: variant.ingredients.map((ing) => ({ id: ing.id.toString(), name: ing.name })),
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
