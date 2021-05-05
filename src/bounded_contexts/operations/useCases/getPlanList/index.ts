import { s3Service } from "../../application/storageService";
import { mockPlanRepository } from "../../infra/repositories/plan";
import { GetPlanList } from "./getPlanList";
import { GetPlanListController } from "./getPlanListController";

export const getPlanList = new GetPlanList(mockPlanRepository, s3Service);
export const getPlanListController = new GetPlanListController(getPlanList);
