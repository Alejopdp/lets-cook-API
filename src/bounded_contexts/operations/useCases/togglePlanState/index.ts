import { mockPlanRepository } from "../../infra/repositories/plan";
import { TogglePlanState } from "./togglePlanState";
import { TogglePlanStateController } from "./togglePlanStateController";

export const togglePlanState: TogglePlanState = new TogglePlanState(mockPlanRepository);
export const togglePlanStateController: TogglePlanStateController = new TogglePlanStateController(togglePlanState);
