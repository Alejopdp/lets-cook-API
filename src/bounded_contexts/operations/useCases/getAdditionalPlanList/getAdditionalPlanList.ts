import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetAdditionalPlanListDto } from "./getAdditionalPlanListDto";
import { GetAdditionalPlanListPresenter } from "./getAdditionalPlanListPresenter";

export class GetAdditionalPlanList {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(dto: GetAdditionalPlanListDto): Promise<Plan[]> {
        if (dto.planId) {
            const plan: Plan = await this.planRepository.findByIdOrThrow(new PlanId(dto.planId), dto.locale);

            return plan.additionalPlans;
        }

        return await this.planRepository.findAdditionalPlanList(dto.locale);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
