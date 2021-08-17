import { Plan } from "../../domain/plan/Plan";
import { Week } from "../../domain/week/Week";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { IStorageService } from "../../application/storageService/IStorageService";

export class GetRecipesByRestrictionsPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(plans: any[]): Promise<any> {
        const presentedPlans = [];

        for (let plan of plans) {
            var presentedVariants = [];
            var presentedRecipes = [];

            for (let variant of plan.planVariants) {
                if (plan.hasRecipes) {
                    presentedVariants.push({
                        id: variant.id.value,
                        sku: variant.sku.code,
                        price: variant.price,
                        priceWithOffer: variant.priceWithOffer,
                        //@ts-ignore
                        numberOfPersons: variant.numberOfPersons,
                        //@ts-ignore
                        numberOfRecipes: variant.numberOfRecipes,
                        attributes: variant.attributes.map((attr: any) => [attr.key, attr.value]),
                    });
                } else {
                    presentedVariants.push({
                        id: variant.id.value,
                        sku: variant.sku.code,
                        price: variant.price,
                        priceWithOffer: variant.priceWithOffer,
                        attributes: variant.attributes.map((attr: any) => [attr.key, attr.value]),
                    });
                }
            }

            for (let recipe of plan.recipes) {
                presentedRecipes.push({
                    id: recipe.id.value,
                    name: recipe.recipeGeneralData.name,
                    sku: recipe.recipeGeneralData.recipeSku.code,
                    shortDescription: recipe.recipeGeneralData.recipeDescription.shortDescription,
                    longDescription: recipe.recipeGeneralData.recipeDescription.longDescription,
                    cookDuration: recipe.recipeGeneralData.cookDuration.value(),
                    cookDurationNumberValue: recipe.recipeGeneralData.cookDuration.timeValue,
                    difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
                    imageUrl: recipe.recipeGeneralData.imageUrl,
                    weight: recipe.recipeGeneralData.recipeWeight.value(),
                    weightNumberValue: recipe.recipeGeneralData.recipeWeight.weightValue,
                    recipeVariants:
                        recipe && recipe.recipeVaraints
                            ? recipe.recipeVaraints.map((variant: any) => {
                                  return {
                                      ingredients: variant.ingredients.map((ing: any) => ing.name),
                                      restrictions: variant.recipeVariantRestriction.map((r: any) => {
                                          return {
                                              id: r.id.value,
                                              value: r.value,
                                              label: r.label,
                                          };
                                      }),
                                      sku: variant.sku.code,
                                  };
                              })
                            : [],
                    imageTags: recipe.recipeImageTags.map((tag: any) => tag.name),
                    backOfficeTags: recipe.recipeBackOfficeTags.map((tag: any) => tag.name),
                    nutritionalInfo: recipe.getPresentedNutritionalInfo(),
                    availableWeeks: recipe.availableWeeks.map((week: Week) => {
                        return {
                            id: week.id.value,
                            label: `${MomentTimeService.getNumberOfDayInMonth(week.minDay)}-${MomentTimeService.getNumberOfDayInMonth(
                                week.maxDay
                            )} ${MomentTimeService.getShortenedMonthName(week.minDay)}`,
                        };
                    }),
                    availableMonths: recipe.availableMonths,
                    relatedPlans: recipe.relatedPlans.map((planId: any) => planId.value),
                    recipeTools: recipe.recipeTools,
                });
            }

            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
                sku: plan.planSku.code,
                description: plan.description,
                availablePlanFrecuencies: plan.availablePlanFrecuencies,
                isActive: plan.isActive,
                type: plan.type,
                imageUrl: plan.imageUrl,
                hasRecipes: plan.hasRecipes,
                variants: presentedVariants,
                additionalPlans: plan.additionalPlans.map((plan: Plan) => plan.id.value),
                recipes: presentedRecipes,
                abilityToChooseRecipes: plan.abilityToChooseRecipes,
                slug: plan.planSlug.slug,
                icon: await this.storageService.getPresignedUrlForFile(plan.iconLinealUrl),
                iconWithColor: await this.storageService.getPresignedUrlForFile(plan.iconLinealColorUrl),
            });
        }

        return presentedPlans;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
