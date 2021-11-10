import { IStorageService } from "../../application/storageService/IStorageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Order } from "../../domain/order/Order";
import { PlanId } from "../../domain/plan/PlanId";
import { Recipe } from "../../domain/recipe/Recipe";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";

export class GetRecipesForOrderPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }
    public async present(recipes: Recipe[], order: Order, subscription: Subscription): Promise<any> {
        const presentedRecipes = [];

        for (let recipe of recipes) {
            presentedRecipes.push(await this.presentRecipe(recipe, subscription));
        }

        return {
            recipes: presentedRecipes.sort((r1, r2) => r1.orderPriority - r2.orderPriority),
            nextDeliveryLabel: order.getHumanShippmentDay(),
            maxRecipesQty: subscription.getMaxRecipesQty(),
            subscriptionId: subscription.id.value,
            actualChosenRecipes: order.recipeSelection.map((recipeSelection) => ({
                recipeId: recipeSelection.recipe.id.value,
                quantity: recipeSelection.quantity,
                recipeVariantId: recipeSelection.recipeVariantId.value,
            })),
        };
    }

    private async presentRecipe(recipe: Recipe, subscription: Subscription): Promise<any> {
        const recipeUrl = recipe.getMainImageUrl() ? await this.storageService.getPresignedUrlForFile(recipe.getMainImageUrl()) : "";

        const recipeImages: string[] = [];

        for (let imageUrl of recipe.getImagesUrls()) {
            const presignedUrl = await this.storageService.getPresignedUrlForFile(imageUrl);
            recipeImages.push(presignedUrl);
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
            availableMonths: recipe.availableMonths,
            relatedPlans: recipe.relatedPlans.map((planId: PlanId) => planId.value),
            tools: recipe.recipeTools,
            recipeVariants: recipe.recipeVariants
                .filter((variant) => variant.restriction.id.equals(subscription.restriction?.id) || !!!subscription.restriction)
                .map((variant) => {
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

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
