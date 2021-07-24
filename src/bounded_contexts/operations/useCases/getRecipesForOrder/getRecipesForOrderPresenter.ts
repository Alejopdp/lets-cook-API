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
            presentedRecipes.push(await this.presentRecipe(recipe));
        }

        return {
            recipes: presentedRecipes,
            nextDeliveryLabel: order.getHumanShippmentDay(),
            maxRecipesQty: subscription.getServingsQuantity(),
        };
    }

    private async presentRecipe(recipe: Recipe): Promise<any> {
        const recipeUrl = recipe.recipeGeneralData.imageUrl
            ? await this.storageService.getPresignedUrlForFile(recipe.recipeGeneralData.imageUrl)
            : "";
        return {
            id: recipe.id.value,
            name: recipe.recipeGeneralData.name,
            sku: recipe.recipeGeneralData.recipeSku.code,
            shortDescription: recipe.recipeGeneralData.recipeDescription.shortDescription,
            longDescription: recipe.recipeGeneralData.recipeDescription.longDescription,
            cookDuration: recipe.recipeGeneralData.cookDuration.value(),
            cookDurationNumberValue: recipe.recipeGeneralData.cookDuration.timeValue,
            difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
            imageUrl: recipeUrl,
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
            recipeVariants: recipe.recipeVariants.map((variant) => {
                return {
                    ingredients: variant.ingredients.map((ing) => ing.name),
                    restrictions: variant.recipeVariantRestrictions.map((r) => {
                        return {
                            id: r.id.value,
                            value: r.value,
                            label: r.label,
                        };
                    }),
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
