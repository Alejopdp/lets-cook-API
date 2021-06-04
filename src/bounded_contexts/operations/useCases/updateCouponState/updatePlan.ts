import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanSku } from "../../domain/plan/PlanSku";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { UpdatePlanDto } from "./updatePlanDto";

export class UpdatePlan {
    private _planRepository: IPlanRepository;
    private _storageService: IStorageService;

    constructor(planRepository: IPlanRepository, storageService: IStorageService) {
        this._planRepository = planRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdatePlanDto): Promise<void> {
        const plan: Plan | undefined = await this.planRepository.findById(new PlanId(dto.id), dto.locale);
        const additionalPlans: Plan[] =
            dto.additionalPlansIds.length > 0
                ? await this.planRepository.findAdditionalPlanListById(
                      dto.additionalPlansIds.map((id: string | number) => new PlanId(id)),
                      dto.locale
                  )
                : [];

        if (!plan) throw new Error("El plan ingresado no existe");

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
                        attr.key.toLowerCase() !== "pricewithoffer"
                );

                let variantWithRecipe: PlanVariantWithRecipe = new PlanVariantWithRecipe(
                    variant.Personas,
                    variant.Recetas,
                    new PlanSku(variant.sku),
                    "",
                    variant.price,
                    variant.priceWithOffer,
                    attributes
                );
                planVariants.push(variantWithRecipe);
            } else {
                attributes = attributes.filter(
                    (attr) =>
                        attr.key.toLowerCase() !== "id" &&
                        attr.key.toLowerCase() !== "sku" &&
                        attr.key.toLowerCase() !== "price" &&
                        attr.key.toLowerCase() !== "pricewithoffer"
                );

                let planVariant: PlanVariant = new PlanVariant(
                    new PlanSku(variant.sku),
                    "",
                    variant.price,
                    attributes,
                    variant.priceWithOffer
                );
                planVariants.push(planVariant);
            }
        }

        if (dto.planImage) {
            const imageUrl = await this.storageService.savePlanImage(dto.planName, dto.planImageFileName, dto.planImage);

            plan.imageUrl = imageUrl;
        }

        plan.availablePlanFrecuencies = dto.availablePlanFrecuencies;
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
}
