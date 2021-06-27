import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetAdditionalPlansByPlanId } from "./getAdditionalPlansByPlanId";
import { GetAdditionalPlansByPlanIdController } from "./getAdditionalPlanByPlanIdController";
import { GetAdditionalPlansByPlanIdPresenter } from "./getAdditionalPlansByPlanIdPresenter";
import { s3Service } from "../../application/storageService";

// export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mockPlanRepository);
export const getAdditionalPlansByPlanId: GetAdditionalPlansByPlanId = new GetAdditionalPlansByPlanId(mongoosePlanRepository);
export const getAdditionalPlansByPlanIdPresenter: GetAdditionalPlansByPlanIdPresenter = new GetAdditionalPlansByPlanIdPresenter(s3Service);
export const getAdditionalPlansByPlanIdController: GetAdditionalPlansByPlanIdController = new GetAdditionalPlansByPlanIdController(
    getAdditionalPlansByPlanId,
    getAdditionalPlansByPlanIdPresenter
);
