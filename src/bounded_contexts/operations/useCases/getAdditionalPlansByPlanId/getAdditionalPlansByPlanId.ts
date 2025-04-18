import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetAdditionalPlanByPlanIdDto } from "./getAdditionalPlanByPlanIdDto";

export class GetAdditionalPlansByPlanId {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(dto: GetAdditionalPlanByPlanIdDto): Promise<Plan[]> {
        var plan: Plan | undefined = await this.planRepository.findById(new PlanId(dto.planId), dto.locale);

        if (!plan) throw new Error("El plan ingresado no existe");

        return plan.additionalPlans;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
