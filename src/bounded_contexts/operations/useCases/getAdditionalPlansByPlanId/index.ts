import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetAdditionalPlansByPlanId } from "./getAdditionalPlansByPlanId";
import { GetAdditionalPlansByPlanIdController } from "./getAdditionalPlanByPlanIdController";
import { GetAdditionalPlansByPlanIdPresenter } from "./getAdditionalPlansByPlanIdPresenter";
import { v3S3Service } from "../../application/storageService";

export const getAdditionalPlansByPlanId: GetAdditionalPlansByPlanId = new GetAdditionalPlansByPlanId(mongoosePlanRepository);
export const getAdditionalPlansByPlanIdPresenter: GetAdditionalPlansByPlanIdPresenter = new GetAdditionalPlansByPlanIdPresenter(v3S3Service);
export const getAdditionalPlansByPlanIdController: GetAdditionalPlansByPlanIdController = new GetAdditionalPlansByPlanIdController(
    getAdditionalPlansByPlanId,
    getAdditionalPlansByPlanIdPresenter
);
