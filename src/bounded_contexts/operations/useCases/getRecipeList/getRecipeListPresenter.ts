import { v3S3Service } from "../../application/storageService";
import { PlanId } from "../../domain/plan/PlanId";
import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";

export class GetRecipeListPresenter {
    public static async present(recipes: Recipe[]): Promise<any> {
        const presentedRecipes = [];

        for (let recipe of recipes) {
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
                imageUrl:
                    Array.isArray(recipe.recipeGeneralData.imagesUrls) && recipe.recipeGeneralData.imagesUrls.length > 0
                        ? await v3S3Service.getPresignedUrlForFile(recipe.getMainImageUrl())
                        : "",
                imagesUrls: recipeImages,
                weight: recipe.recipeGeneralData.recipeWeight.value(),
                weightNumberValue: recipe.recipeGeneralData.recipeWeight.weightValue,
                backOfficeTags: recipe.recipeBackOfficeTags.map((tag) => tag.name),
                imageTags: recipe.recipeImageTags.map((tag) => tag.name),
                availableWeeks: recipe.availableWeeks.map((week: Week) => {
                    const minDate = new Date(week.minDay);
                    minDate.setDate(minDate.getDate() - 1);
                    const maxDate = new Date(week.maxDay);
                    maxDate.setDate(maxDate.getDate() - 1);

                    return {
                        id: week.id.value,
                        label: week.getShorterLabel(),
                        fecha_inicio: minDate.toISOString().split("T")[0],
                        fecha_fin: maxDate.toISOString().split("T")[0]
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
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt
            });
        }
        return presentedRecipes.sort((r1, r2) => r1.orderPriority! - r2.orderPriority!);
    }
}
