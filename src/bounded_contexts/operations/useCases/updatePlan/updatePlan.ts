import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanFrequencyFactory } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanSku } from "../../domain/plan/PlanSku";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { UpdatePlanDto } from "./updatePlanDto";

export class UpdatePlan {
    private _planRepository: IPlanRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _storageService: IStorageService;

    constructor(planRepository: IPlanRepository, subscriptionRepository: ISubscriptionRepository, storageService: IStorageService) {
        this._planRepository = planRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdatePlanDto): Promise<void> {
        const plan: Plan | undefined = await this.planRepository.findById(new PlanId(dto.id), dto.locale);
        if (!plan) throw new Error("El plan ingresado no existe");

        const additionalPlans: Plan[] =
            dto.additionalPlansIds.length > 0
                ? await this.planRepository.findAdditionalPlanListById(
                      //@ts-ignore
                      dto.additionalPlansIds.map((id: string | number) => new PlanId(id)),
                      dto.locale
                  )
                : [];

        const planSku: PlanSku = new PlanSku(dto.planSku);
        const planVariants: PlanVariant[] = [];

        for (let variant of dto.planVariants) {
            var attributes: PlanVariantAttribute[] = [];

            attributes = Object.entries(variant).map((entry) => new PlanVariantAttribute(entry[0], entry[1] as string));

            if (dto.hasRecipes) {
                attributes = attributes.filter(
                    (attr) =>
                        attr.key.toLowerCase() !== "personas" &&
                        attr.key.toLowerCase() !== "recetas" &&
                        attr.key.toLowerCase() !== "id" &&
                        attr.key.toLowerCase() !== "sku" &&
                        attr.key.toLowerCase() !== "price" &&
                        attr.key.toLowerCase() !== "pricewithoffer" &&
                        attr.key.toLowerCase() !== "isdefault" &&
                        attr.key.toLowerCase() !== "isdeleted" &&
                        attr.key.toLowerCase() !== "deleted" &&
                        attr.key.toLowerCase() !== "description" &&
                        attr.key.toLowerCase() !== "attributes" &&
                        attr.key.toLowerCase() !== "auxid" &&
                        attr.key.toLowerCase() !== "oldid"
                );

                let variantWithRecipe: PlanVariantWithRecipe = new PlanVariantWithRecipe(
                    variant.Personas,
                    variant.Recetas,
                    new PlanSku(variant.sku),
                    "",
                    variant.price,
                    variant.priceWithOffer,
                    attributes,
                    variant.description,
                    variant.isDefault,
                    variant.isDeleted,
                    new PlanVariantId(variant.oldId)
                    // variant.description
                );
                planVariants.push(variantWithRecipe);
            } else {
                attributes = attributes.filter(
                    (attr) =>
                        attr.key.toLowerCase() !== "id" &&
                        attr.key.toLowerCase() !== "sku" &&
                        attr.key.toLowerCase() !== "price" &&
                        attr.key.toLowerCase() !== "pricewithoffer" &&
                        attr.key.toLowerCase() !== "isdefault" &&
                        attr.key.toLowerCase() !== "isdeleted" &&
                        attr.key.toLowerCase() !== "deleted" &&
                        attr.key.toLowerCase() !== "description" &&
                        attr.key.toLowerCase() !== "attributes"
                );

                let planVariant: PlanVariant = new PlanVariant(
                    new PlanSku(variant.sku),
                    "",
                    variant.price,
                    attributes,
                    variant.description,
                    variant.isDefault,
                    variant.isDeleted,
                    variant.priceWithOffer,
                    new PlanVariantId(variant.id)
                );
                planVariants.push(planVariant);
            }
        }

        if (planVariants.every((variant) => !variant.isDefault))
            throw new Error("Es necesario indicar por lo menos una variante como default");
        if (planVariants.some((variatn) => variatn.isDefault && variatn.isDeleted))
            throw new Error("No es posible marcar como default una varianta marcada como eliminada");

        const planVariantsIds: PlanVariantId[] = planVariants.reduce(
            (acc: PlanVariantId[], planVariant) => (planVariant.isDeleted ? [...acc, planVariant.id] : acc),
            []
        );

        const subscriptionsWithOneOfThePlanVariants = await this.subscriptionRepository.findActiveSubscriptionByPlanVariantsIds(
            planVariantsIds
        );

        if (subscriptionsWithOneOfThePlanVariants.length > 0)
            throw new Error("No puedes borrar una variante que está relacionada a una suscripción activa");

        if (dto.planImage) {
            const imageUrl = await this.storageService.savePlanImage(dto.planName, dto.planImageFileName, dto.planImage);

            plan.imageUrl = imageUrl;
        }

        // if (dto.iconLinealFile) {
        //     const iconLinealUrl = await this.storageService.saveIconLineal(dto.planName, dto.planImageFileName, dto.iconLinealFile);

        //     plan.iconLinealUrl = iconLinealUrl;
        // }

        // if (dto.iconLinealColorFile) {
        //     const iconLinealColorUrl = await this.storageService.saveIconLinealColor(dto.planName, dto.iconLinealColorFileName, dto.iconLinealColorFile);

        //     plan.iconLinealColorUrl = iconLinealColorUrl;
        // }

        plan.availablePlanFrecuencies = dto.availablePlanFrecuencies.map((freq: string) => PlanFrequencyFactory.createPlanFrequency(freq));
        plan.description = dto.planDescription;
        plan.isActive = dto.isActive;
        plan.name = dto.planName;
        plan.planVariants = planVariants;
        plan.planSku = planSku;
        plan.updateAdditionalPlans(additionalPlans);
        plan.changeType(dto.planType);

        if (!dto.hasRecipes && dto.hasRecipes !== plan.hasRecipes) {
            plan.hasRecipes = dto.hasRecipes;
            // TO DO: Update Recipe relations
        } else {
            plan.hasRecipes = dto.hasRecipes;
        }

        await this.planRepository.save(plan);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
}
