import { s3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetAdditionalPlanList } from "./getAdditionalPlanList";
import { GetAdditionalPlanListController } from "./getAdditionalPlanListController";
import { GetAdditionalPlanListPresenter } from "./getAdditionalPlanListPresenter";

// export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mockPlanRepository);
export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mongoosePlanRepository);
export const getAdditionalPlanListPresenter: GetAdditionalPlanListPresenter = new GetAdditionalPlanListPresenter(s3Service);
export const getAdditionalPlanListController: GetAdditionalPlanListController = new GetAdditionalPlanListController(
    getAdditionalPlanList,
    getAdditionalPlanListPresenter
);
