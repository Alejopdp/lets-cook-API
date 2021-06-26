import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { TogglePlanState } from "./togglePlanState";
import { TogglePlanStateController } from "./togglePlanStateController";

// export const togglePlanState: TogglePlanState = new TogglePlanState(mockPlanRepository);
export const togglePlanState: TogglePlanState = new TogglePlanState(mongoosePlanRepository);
export const togglePlanStateController: TogglePlanStateController = new TogglePlanStateController(togglePlanState);
