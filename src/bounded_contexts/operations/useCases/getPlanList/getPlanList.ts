import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetPlanListPresenter } from "./getPlanListPresenter";

export class GetPlanList {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(): Promise<any> {
        const plans: Plan[] = await this.planRepository.findAll();

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
     * Setter planRepository
     * @param {IPlanRepository} value
     */
    public set planRepository(value: IPlanRepository) {
        this._planRepository = value;
    }
}
