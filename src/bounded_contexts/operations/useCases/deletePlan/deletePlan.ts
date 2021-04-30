import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { DeletePlanDto } from "./deletePlanDto";

export class DeletePlan {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(dto: DeletePlanDto): Promise<void> {
        const planId: PlanId = new PlanId(dto.planId);
        const plan: Plan | undefined = await this.planRepository.findById(planId);

        // TO DO: validations

        await this.planRepository.delete(planId);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
