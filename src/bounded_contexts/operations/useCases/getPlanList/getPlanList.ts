import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetPlanListDto } from "./getPlanListDto";
import { GetPlanListPresenter } from "./getPlanListPresenter";

export class GetPlanList {
    private _planRepository: IPlanRepository;
    private _storageService: IStorageService;

    constructor(planRepository: IPlanRepository, storageService: IStorageService) {
        this._planRepository = planRepository;
        this._storageService = storageService;
    }

    public async execute(dto: GetPlanListDto): Promise<any> {
        var plans: Plan[] = await this.planRepository.findAll(dto.locale);

        for (let plan of plans) {
            plan.imageUrl = await this.storageService.getPresignedUrlForFile(plan.imageUrl);
        }

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
