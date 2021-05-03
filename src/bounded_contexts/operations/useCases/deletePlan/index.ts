import { mockPlanRepository } from "../../infra/repositories/plan";
import { DeletePlan } from "./deletePlan";
import { DeletePlanController } from "./deletePlanController";

export const deletePlan: DeletePlan = new DeletePlan(mockPlanRepository);
export const deletePlanController: DeletePlanController = new DeletePlanController(deletePlan);
