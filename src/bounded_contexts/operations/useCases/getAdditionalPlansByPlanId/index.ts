import { mockPlanRepository, mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetAdditionalPlansByPlanId } from "./getAdditionalPlansByPlanId";
import { GetAdditionalPlansByPlanIdController } from "./getAdditionalPlanByPlanIdController";

// export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mockPlanRepository);
export const getAdditionalPlansByPlanId: GetAdditionalPlansByPlanId = new GetAdditionalPlansByPlanId(mongoosePlanRepository);
export const getAdditionalPlansByPlanIdController: GetAdditionalPlansByPlanIdController = new GetAdditionalPlansByPlanIdController(getAdditionalPlansByPlanId);
