import { s3Service } from "../../application/storageService";
import { mockPlanRepository } from "../../infra/repositories/plan";
import { UpdatePlan } from "./updatePlan";
import { UpdatePlanController } from "./updatePlanController";

export const updatePlan: UpdatePlan = new UpdatePlan(mockPlanRepository, s3Service);
export const updatePlanController: UpdatePlanController = new UpdatePlanController(updatePlan);
