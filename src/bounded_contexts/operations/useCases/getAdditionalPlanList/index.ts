import { v3S3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetAdditionalPlanList } from "./getAdditionalPlanList";
import { GetAdditionalPlanListController } from "./getAdditionalPlanListController";
import { GetAdditionalPlanListPresenter } from "./getAdditionalPlanListPresenter";

export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mongoosePlanRepository);
export const getAdditionalPlanListPresenter: GetAdditionalPlanListPresenter = new GetAdditionalPlanListPresenter(v3S3Service);
export const getAdditionalPlanListController: GetAdditionalPlanListController = new GetAdditionalPlanListController(
    getAdditionalPlanList,
    getAdditionalPlanListPresenter
);
