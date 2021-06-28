import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import _ from "lodash";

export class GetPlanListPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(plans: Plan[]): Promise<any> {
        const presentedPlans = [];

        for (let plan of plans) {
            var presentedVariants = this.presentVariants(plan);

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

    public presentVariants(plan: Plan): any {
        var attributes = [];
        var attributesAndValues = [];
        var presentedVariants = [];
        var counter = 0;

        attributes = _.uniq(_.flatten(plan.planVariants.map((variant) => variant.attributes.map((attr) => attr.key)))).map((key) => [
            key,
            [],
        ]);

        for (let i = 0; i < plan.planVariants.length; i++) {
            var variant = plan.planVariants[i];
            for (let attr of variant.attributes) {
                //@ts-ignore
                attributes[counter][1] = _.uniq([...attributes[counter][1], attr.value]);
                counter++;
            }

            if (plan.hasRecipes) {
                presentedVariants.push({
                    oldId: variant.getConcatenatedAttributesAsString(),
                    id: variant.id.value,
                    sku: variant.sku.code,
                    name: variant.name,
                    price: variant.price,
                    priceWithOffer: variant.priceWithOffer,
                    //@ts-ignore
                    Personas: variant.numberOfPersons,
                    //@ts-ignore
                    Recetas: variant.numberOfRecipes,
                    attributes: variant.attributes.map((attr) => [attr.key, attr.value]),
                });
            } else {
                presentedVariants.push({
                    oldId: variant.getConcatenatedAttributesAsString(),
                    id: variant.id.value,
                    sku: variant.sku.code,
                    name: variant.name,
                    price: variant.price,
                    priceWithOffer: variant.priceWithOffer,
                    attributes: variant.attributes.map((attr) => [attr.key, attr.value]),
                });
            }
            counter = 0;
        }

        if (plan.hasRecipes) {
            //@ts-ignore
            attributesAndValues.push(["Personas", _.uniq(plan.planVariants.map((variant) => variant.numberOfPersons))]);
            //@ts-ignore
            attributesAndValues.push(["Recetas", _.uniq(plan.planVariants.map((variant) => variant.numberOfRecipes))]);
        }

        return presentedVariants;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
