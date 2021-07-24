import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";

export class GetAdditionalPlanListPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(additionalPlans: Plan[]): Promise<any> {
        const presentedPlans = [];

        for (let plan of additionalPlans) {
            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
                description: plan.description,
                type: plan.type,
                availableFrequencies: plan.availablePlanFrecuencies,
                hasRecipes: plan.hasRecipes,
                imageUrl: plan.imageUrl ? await this.storageService.getPresignedUrlForFile(plan.imageUrl) : "",
                isActive: plan.isActive,
                sku: plan.planSku.code,
                icon: plan.iconLinealUrl ? await this.storageService.getPresignedUrlForFile(plan.iconLinealUrl) : "",
                iconWithColor: plan.iconLinealColorUrl ? await this.storageService.getPresignedUrlForFile(plan.iconLinealColorUrl) : "",
                abilityToChooseRecipes: plan.abilityToChooseRecipes,
                variants: plan.planVariants.map((variant) => this.presentPlanVariant(variant, plan.hasRecipes)),
                slug: plan.planSlug.slug,
            });
        }

        return presentedPlans;
    }

    private presentPlanVariant(variant: PlanVariant, hasRecipes: boolean): any {
        if (hasRecipes) {
            return {
                id: variant.id.value,
                sku: variant.sku.code,
                name: variant.name,
                price: variant.price,
                priceWithOffer: variant.priceWithOffer,
                //@ts-ignore
                numberOfPersons: variant.numberOfPersons,
                //@ts-ignore
                numberOfRecipes: variant.numberOfRecipes,
                attributes: variant.attributes.map((attr: any) => [attr.key, attr.value]),
            };
        } else {
            return {
                id: variant.id.value,
                sku: variant.sku.code,
                name: variant.name,
                price: variant.price,
                priceWithOffer: variant.priceWithOffer,
                attributes: variant.attributes.map((attr: any) => [attr.key, attr.value]),
            };
        }
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
