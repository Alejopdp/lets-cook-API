import { mockPlanRepository } from "../../infra/repositories/plan";
import { GetAdditionalPlanList } from "./getAdditionalPlanList";
import { GetAdditionalPlanListController } from "./getAdditionalPlanListController";

export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mockPlanRepository);
export const getAdditionalPlanListController: GetAdditionalPlanListController = new GetAdditionalPlanListController(getAdditionalPlanList);
