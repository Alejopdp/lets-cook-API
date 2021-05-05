import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetPlanListPresenter } from "./getPlanListPresenter";

export class GetPlanList {
    private _planRepository: IPlanRepository;
    private _storageService: IStorageService;

    constructor(planRepository: IPlanRepository, storageService: IStorageService) {
        this._planRepository = planRepository;
        this._storageService = storageService;
    }

    public async execute(): Promise<any> {
        var plans: Plan[] = await this.planRepository.findAll();

        // TO DO: Change for forEach when db is implemented
        plans = [
            ...plans.map((plan) =>
                Plan.create(
                    plan.name,
                    plan.description,
                    plan.planSku,
                    (plan.imageUrl = plan.imageUrl ? this.storageService.getPresignedUrlForFile(plan.imageUrl) : plan.imageUrl),
                    plan.isActive,
                    plan.type,
                    plan.planVariants,
                    plan.availablePlanFrecuencies,
                    plan.hasRecipes,
                    plan.id
                )
            ),
        ];

        return GetPlanListPresenter.present(plans);
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
