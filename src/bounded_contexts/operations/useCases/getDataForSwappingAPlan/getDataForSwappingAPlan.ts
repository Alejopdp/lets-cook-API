import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetDataForSwappingAPlanDto } from "./getDataForSwappingAPlanDto";

export class GetDataForSwappingAPlan {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }
    public async execute(dto: GetDataForSwappingAPlanDto): Promise<Plan[]> {
        const plans: Plan[] = await this.planRepository.findAll(dto.locale);

        return plans;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
