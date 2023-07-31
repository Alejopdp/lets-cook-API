import { v3S3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetPlanList } from "./getPlanList";
import { GetPlanListController } from "./getPlanListController";
import { GetPlanListPresenter } from "./getPlanListPresenter";

export const getPlanList = new GetPlanList(mongoosePlanRepository, v3S3Service);
export const getPlanListPresenter = new GetPlanListPresenter(v3S3Service);
export const getPlanListController = new GetPlanListController(getPlanList, getPlanListPresenter);
