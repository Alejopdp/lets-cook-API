import { logger } from "../../../../../config";
import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetPlanAhorroDto } from "./getPlanAhorroDto";

export class GetPlanAhorro {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(dto: GetPlanAhorroDto): Promise<Plan> {
        var plan: Plan | undefined = await this.planRepository.findPlanAhorro(dto.locale);

        if (!plan) throw new Error("El plan ingresado no existe");

        return plan;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
