import { IStorageService } from "../../application/storageService/IStorageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { PlanId } from "../../domain/plan/PlanId";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";

export type GetRecipesForOrderPresenterResponse = {
    recipes: PresentedRecipe[];
    nextDeliveryLabel: string;
    maxRecipesQty: number;
    subscriptionId: string;
    actualChosenRecipes: any[];
    planId: string;
};

type PresentedRecipe = {
    id: string;
    name: string;
    sku: string;
    shortDescription: string;
    longDescription: string;
    cookDuration: string;
    cookDurationNumberValue: number;
    nutritionalInfo: any;
    difficultyLevel: string;
    orderPriority: number | undefined;
    imageUrl: string;
    imagesUrls: string[];
    weight: string;
    weightNumberValue: number;
    backOfficeTags: string[];
    imageTags: string[];
    availableWeeks: any[];
    availableMonths: string[];
    relatedPlans: string[];
    tools: string[];
    recipeVariants: any[];
    userRating: number;
    averageRating: number;
};


export class GetRecipesForOrderPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }
    public async present(recipes: Recipe[], order: Order, subscription: Subscription, locale: Locale, recipeRatings: RecipeRating[], averageRecipeRatingsMap: Map<string, number>): Promise<GetRecipesForOrderPresenterResponse> {
        const presentedRecipes = [];
        const recipeRateMap = new Map<string, number>();

        for (let recipeRating of recipeRatings) {
            recipeRateMap.set(recipeRating.recipe.id.toString(), recipeRating.rating ?? 0);
        }

        for (let recipe of recipes) {
            presentedRecipes.push(await this.presentRecipe(recipe, subscription, recipeRateMap.get(recipe.id.toString()) ?? 0, averageRecipeRatingsMap));
        }

        return {
            recipes: presentedRecipes.sort((r1, r2) => r1.orderPriority! - r2.orderPriority!),
            nextDeliveryLabel: order.getHumanShippmentDay(locale),
            maxRecipesQty: order.getNumberOfRecipesOrReturn0(),
            subscriptionId: subscription.id.toString(),
            actualChosenRecipes: order.recipeSelection.map((recipeSelection) => ({
                recipeId: recipeSelection.recipe.id.value,
                quantity: recipeSelection.quantity,
                recipeVariantId: recipeSelection.recipeVariantId.value,
            })),
            planId: subscription.plan.id.toString(),
        };
    }

    private async presentRecipe(recipe: Recipe, subscription: Subscription, recipeRating: number, averageRecipeRatingsMap: Map<string, number>): Promise<PresentedRecipe> {
        const recipeUrl = recipe.getMainImageUrl() ? await this.storageService.getPresignedUrlForFile(recipe.getMainImageUrl()) : "";

        const recipeImages: string[] = [];

        for (let imageUrl of recipe.getImagesUrls()) {
            const presignedUrl = await this.storageService.getPresignedUrlForFile(imageUrl);
            recipeImages.push(presignedUrl);
        }
        return {
            id: recipe.id.toString(),
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
            relatedPlans: recipe.relatedPlans.map((planId: PlanId) => planId.toString()),
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
            userRating: recipeRating,
            averageRating: averageRecipeRatingsMap.get(recipe.id.toString()) ?? 0,
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
