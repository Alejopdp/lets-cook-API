import { Plan } from "../../domain/plan/Plan";
import { Week } from "../../domain/week/Week";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Recipe } from "../../domain/recipe/Recipe";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { Locale } from "../../domain/locale/Locale";

export class GetPlanVariantsRecipesByWeekListPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(plans: Plan[], recipes: Recipe[], week: Week, locale: Locale): Promise<any> {
        const presentedPlans = [];
        const planRecipeMap: { [key: string]: any[] } = {};
        const presentedRecipes = [];
        const presentedAdditionalPlansMap: { [key: string]: any[] } = {};
        var uniqAdditionalPlansIds: PlanId[] = [];

        // Recipes
        for (let recipe of recipes) {
            const presentedRecipe = await this.presentRecipe(recipe);

            presentedRecipes.push(presentedRecipe);

            for (let planId of recipe.relatedPlans) {
                const actualArray = planRecipeMap[planId.value] || [];
                planRecipeMap[planId.value.toString()] = [...actualArray, presentedRecipe];
            }
        }

        // Additional plans
        for (let plan of plans) {
            for (let additionalPlan of plan.additionalPlans) {
                if (
                    additionalPlan.isActive &&
                    (uniqAdditionalPlansIds.length === 0 || !additionalPlan.id.equals(uniqAdditionalPlansIds[0]))
                ) {
                    uniqAdditionalPlansIds = [additionalPlan.id, ...uniqAdditionalPlansIds];

                    var presentedVariants = [];

                    for (let variant of plan.planVariants) {
                        presentedVariants.push(this.presentPlanVariant(variant, plan.hasRecipes, additionalPlan, locale));
                    }

                    presentedAdditionalPlansMap[additionalPlan.id.value] = await this.presentPlan(
                        additionalPlan,
                        presentedVariants,
                        planRecipeMap[additionalPlan.id.value],
                        []
                    );
                }
            }
        }

        // Principal plans
        for (let plan of plans) {
            if (plan.isPrincipal() && plan.isActive) {
                var presentedVariants = [];

                for (let variant of plan.planVariants) {
                    if (!variant.isDeleted) presentedVariants.push(this.presentPlanVariant(variant, plan.hasRecipes, plan, locale));
                }

                const presentedAdditionalPlans = plan.additionalPlans.map(
                    (additionalPlan) => presentedAdditionalPlansMap[additionalPlan.id.value]
                );
                presentedPlans.push(
                    await this.presentPlan(plan, presentedVariants, planRecipeMap[plan.id.value], presentedAdditionalPlans)
                );
            }
        }

        return { plans: presentedPlans, weekLabel: week.getLabel(locale) };
    }

    private async presentRecipe(recipe: Recipe): Promise<any> {
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
            orderPriority: recipe.orderPriority,
            difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
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

    private presentPlanVariant(variant: PlanVariant, hasRecipes: boolean, plan: Plan, locale: Locale): any {
        return {
            id: variant.id.value,
            planId: plan.id.value,
            sku: variant.sku.code,
            price: variant.price,
            priceWithOffer: variant.priceWithOffer,
            numberOfPersons: variant.numberOfPersons,
            numberOfRecipes: variant.numberOfRecipes,
            Personas: variant.numberOfPersons,
            Recetas: variant.numberOfRecipes,
            attributes: variant.attributes.map((attr: any) => [attr.key, attr.value]),
            label: variant.getLabel(locale),
            isDefault: variant.isDefault,
            isDeleted: variant.isDeleted,
            auxId:
                variant.attributes.reduce((acc, attribute) => acc + attribute.value, "") +
                //@ts-ignore
                (variant.numberOfPersons?.toString() || "") +
                //@ts-ignore
                (variant.numberOfRecipes?.toString() || ""),
        };
    }

    private async presentPlan(
        plan: Plan,
        presentedVariants: any[],
        presentedRecipes: any[],
        presentedAdditionalPlans: any[]
    ): Promise<any> {
        const icon = await this.storageService.getPresignedUrlForFile(plan.iconLinealUrl);
        const iconWithColor = await this.storageService.getPresignedUrlForFile(plan.iconLinealColorUrl);
        const imageUrl = await this.storageService.getPresignedUrlForFile(plan.imageUrl);

        return {
            id: plan.id.value,
            name: plan.name,
            sku: plan.planSku.code,
            description: plan.description,
            availablePlanFrecuencies: plan.availablePlanFrecuencies,
            isActive: plan.isActive,
            type: plan.type,
            imageUrl,
            hasRecipes: plan.hasRecipes,
            variants: presentedVariants,
            additionalPlans: presentedAdditionalPlans,
            recipes: (presentedRecipes || []).sort((r1, r2) => r1.orderPriority - r2.orderPriority),
            abilityToChooseRecipes: plan.abilityToChooseRecipes,
            slug: plan.planSlug.slug, // TO DO: Get it from aggregate root
            icon,
            iconWithColor,
            minimumVariantPrice: plan.getMinimumVariantPrice(),
            isDefaultAtCheckout: plan.isDefaultAtCheckout,
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
