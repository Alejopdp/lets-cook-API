import _ from "lodash";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";

export class GetPlanByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(plan: Plan): Promise<any> {
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

        return {
            id: plan.id.value,
            name: plan.name,
            sku: plan.planSku.code,
            description: plan.description,
            availablePlanFrecuencies: plan.availablePlanFrecuencies,
            isActive: plan.isActive,
            type: plan.type,
            imageUrl: plan.imageUrl ? await this.storageService.getPresignedUrlForFile(plan.imageUrl) : "",
            hasRecipes: plan.hasRecipes,
            variants: presentedVariants,
            attributes: [...attributesAndValues, ...attributes],
            additionalPlans: plan.additionalPlans.map((plan) => {
                return { id: plan.id.value, name: plan.name };
            }),
            icon: plan.iconLinealUrl ? await this.storageService.getPresignedUrlForFile(plan.iconLinealUrl) : "",
            iconWithColor: plan.iconLinealColorUrl ? await this.storageService.getPresignedUrlForFile(plan.iconLinealColorUrl) : "",
            abilityToChooseRecipes: plan.abilityToChooseRecipes,
            slug: plan.planSlug.slug,
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
