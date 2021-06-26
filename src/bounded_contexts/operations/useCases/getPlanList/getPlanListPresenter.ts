import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";

export class GetPlanListPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(plans: Plan[]): Promise<any> {
        const presentedPlans = [];

        for (let plan of plans) {
            var presentedVariants = [];

            for (let variant of plan.planVariants) {
                if (plan.hasRecipes) {
                    presentedVariants.push({
                        id: variant.id.value,
                        sku: variant.sku.code,
                        name: variant.name,
                        price: variant.price,
                        priceWithOffer: variant.priceWithOffer,
                        //@ts-ignore
                        numberOfPersons: variant.numberOfPersons,
                        //@ts-ignore
                        numberOfRecipes: variant.numberOfRecipes,
                        attributes: variant.attributes.map((attr) => [attr.key, attr.value]),
                    });
                } else {
                    presentedVariants.push({
                        id: variant.id.value,
                        sku: variant.sku.code,
                        name: variant.name,
                        price: variant.price,
                        priceWithOffer: variant.priceWithOffer,
                        attributes: variant.attributes.map((attr) => [attr.key, attr.value]),
                    });
                }
            }

            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
                sku: plan.planSku.code,
                description: plan.description,
                availablePlanFrecuencies: plan.availablePlanFrecuencies,
                isActive: plan.isActive,
                type: plan.type,
                imageUrl: await this.storageService.getPresignedUrlForFile(plan.imageUrl),
                hasRecipes: plan.hasRecipes,
                variants: presentedVariants,
                additionalPlans: plan.additionalPlans.map((plan: Plan) => plan.id.value),
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
