import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanSku } from "../../domain/plan/PlanSku";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { CreatePlanDto } from "./createPlanDto";

export class CreatePlan {
    private _planRepository: IPlanRepository;
    private _storageService: IStorageService;

    constructor(planRepository: IPlanRepository, storageService: IStorageService) {
        this._planRepository = planRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CreatePlanDto): Promise<void> {
        const planSku: PlanSku = new PlanSku(dto.planSku);
        const planVariants: PlanVariant[] = [];
        const locale: Locale = (<any>Locale)[dto.locale] || Locale.es;
        const additionalPlans: Plan[] =
            dto.additionalPlansIds.length > 0
                ? await this.planRepository.findAdditionalPlanListById(
                      dto.additionalPlansIds.map((id: string | number) => new PlanId(id)),
                      dto.locale
                  )
                : [];

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

        const plan: Plan = Plan.create(
            dto.planName,
            dto.planDescription,
            planSku,
            "",
            dto.isActive,
            dto.planType,
            planVariants,
            dto.availablePlanFrecuencies,
            dto.hasRecipes,
            additionalPlans,
            locale
        );

        const imageUrl = await this.storageService.savePlanImage(dto.planName, dto.planImageFileName, dto.planImage);

        plan.imageUrl = imageUrl;

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
