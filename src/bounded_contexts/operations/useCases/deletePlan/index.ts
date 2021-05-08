import { mockPlanRepository, mongoosePlanRepository } from "../../infra/repositories/plan";
import { DeletePlan } from "./deletePlan";
import { DeletePlanController } from "./deletePlanController";

// export const deletePlan: DeletePlan = new DeletePlan(mockPlanRepository);
export const deletePlan: DeletePlan = new DeletePlan(mongoosePlanRepository);
export const deletePlanController: DeletePlanController = new DeletePlanController(deletePlan);
