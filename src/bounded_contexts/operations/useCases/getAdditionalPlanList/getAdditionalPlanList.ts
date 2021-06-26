import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetAdditionalPlanListDto } from "./getAdditionalPlanListDto";
import { GetAdditionalPlanListPresenter } from "./getAdditionalPlanListPresenter";

export class GetAdditionalPlanList {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    public async execute(dto: GetAdditionalPlanListDto): Promise<Plan[]> {
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
