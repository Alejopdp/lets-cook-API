import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetAdditionalPlanList } from "./getAdditionalPlanList";
import { GetAdditionalPlanListController } from "./getAdditionalPlanListController";

// export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mockPlanRepository);
export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mongoosePlanRepository);
export const getAdditionalPlanListController: GetAdditionalPlanListController = new GetAdditionalPlanListController(getAdditionalPlanList);
