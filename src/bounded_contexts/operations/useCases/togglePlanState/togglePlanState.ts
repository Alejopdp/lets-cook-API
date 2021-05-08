import { logger } from "../../../../../config";
import { Plan } from "../../domain/plan/Plan";
import { PlanId } from "../../domain/plan/PlanId";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { TogglePlanStateDto } from "./togglePlanStateDto";

export class TogglePlanState {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(dto: TogglePlanStateDto): Promise<any> {
        const planId: PlanId = new PlanId(dto.planId);
        const plan: Plan | undefined = await this.planRepository.findById(planId, dto.locale);

        if (!plan) throw new Error("El plan indicado no existe");

        plan.toggleState();

        logger.warn(`Después de togglear, antes del save: ${JSON.stringify(plan)}`);

        await this.planRepository.save(plan);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
