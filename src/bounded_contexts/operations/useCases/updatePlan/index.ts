import { s3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { UpdatePlan } from "./updatePlan";
import { UpdatePlanController } from "./updatePlanController";

// export const updatePlan: UpdatePlan = new UpdatePlan(mockPlanRepository, s3Service);
export const updatePlan: UpdatePlan = new UpdatePlan(mongoosePlanRepository, s3Service);
export const updatePlanController: UpdatePlanController = new UpdatePlanController(updatePlan);
