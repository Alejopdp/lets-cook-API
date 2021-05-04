import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetAdditionalPlanListPresenter } from "./getAdditionalPlanListPresenter";

export class GetAdditionalPlanList {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(): Promise<any> {
        const plans: Plan[] = await this.planRepository.findAdditionalPlanList();

        return GetAdditionalPlanListPresenter.present(plans);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
