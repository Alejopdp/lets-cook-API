import { s3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetPlanList } from "./getPlanList";
import { GetPlanListController } from "./getPlanListController";

// export const getPlanList = new GetPlanList(mockPlanRepository, s3Service);
export const getPlanList = new GetPlanList(mongoosePlanRepository, s3Service);
export const getPlanListController = new GetPlanListController(getPlanList);
