import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import _ from "lodash";
import { locale } from "moment";
import { Locale } from "../../domain/locale/Locale";

export class GetPlanListPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(plans: Plan[], locale: Locale): Promise<any> {
        const presentedPlans = [];

        for (let plan of plans) {
            var presentedVariants = this.presentVariants(plan, locale);

            presentedPlans.push({
                id: plan.id.value,
                name: plan.name,
                sku: plan.planSku.code,
                description: plan.description,
                availablePlanFrecuencies: plan.availablePlanFrecuencies.map((freq) => freq.value()),
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
                isDefaultAtCheckout: plan.isDefaultAtCheckout,
            });
        }

        return presentedPlans;
    }

    public presentVariants(plan: Plan, locale: Locale): any {
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

            presentedVariants.push({
                id: variant.id.value,
                sku: variant.sku.code,
                price: variant.price,
                priceWithOffer: variant.priceWithOffer,
                Personas: variant.numberOfPersons,
                Recetas: variant.numberOfRecipes,
                description: variant.getLabel(locale),
                descriptionWithPrice: variant.getLabelWithPrice(locale),
                attributes: variant.attributes.map((attr) => [attr.key, attr.value]),
                isDeleted: variant.isDeleted
            });
            counter = 0;
        }

        if (plan.planVariants.every((v) => !!v.numberOfPersons)) {
            attributesAndValues.push(["Personas", _.uniq(plan.planVariants.map((variant) => variant.numberOfPersons))]);
        }

        if (plan.planVariants.every((v) => !!v.numberOfRecipes)) {
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
