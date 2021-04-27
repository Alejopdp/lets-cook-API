import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanSku } from "../../domain/plan/PlanSku";
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
        const plan: Plan = Plan.create(
            dto.planName,
            dto.planDescription,
            planSku,
            "",
            dto.isActive,
            dto.planType,
            dto.planVariants,
            dto.availablePlanFrecuencies
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
