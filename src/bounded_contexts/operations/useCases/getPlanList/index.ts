import { mockPlanRepository } from "../../infra/repositories/plan";
import { GetPlanList } from "./getPlanList";
import { GetPlanListController } from "./getPlanListController";

export const getPlanList = new GetPlanList(mockPlanRepository);
export const getPlanListController = new GetPlanListController(getPlanList);
