import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetPlanByIdDto } from "./getPlanByIdDto";
import { GetPlanByIdPresenter } from "./getPlanByIdPresenter";

export class GetPlanById {
    private _planRepository: IPlanRepository;
    private _storageService: IStorageService;

    constructor(planRepository: IPlanRepository, storageService: IStorageService) {
        this._planRepository = planRepository;
        this._storageService = storageService;
    }

    public async execute(dto: GetPlanByIdDto): Promise<any> {
        var plan: Plan | undefined = await this.planRepository.findById(new PlanId(dto.planId));

        if (!plan) throw new Error("El plan ingresado no existe");

        // TO DO Change when db is implemented
        plan = Plan.create(
            plan.name,
            plan.description,
            plan.planSku,
            plan.imageUrl ? this.storageService.getPresignedUrlForFile(plan.imageUrl) : "",
            plan.isActive,
            plan.type,
            plan.planVariants,
            plan.availablePlanFrecuencies,
            plan.hasRecipes,
            plan.id
        );

        // plan.imageUrl = plan.imageUrl ? this.storageService.getPresignedUrlForFile(plan.imageUrl) : "";

        return GetPlanByIdPresenter.present(plan);
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
