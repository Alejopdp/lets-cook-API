import { s3Service } from "../../application/storageService";
import { mockPlanRepository, mongoosePlanRepository } from "../../infra/repositories/plan";
import { CreatePlan } from "./createPlan";
import { CreatePlanController } from "./createPlanController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const createPlan: CreatePlan = new CreatePlan(mongoosePlanRepository, s3Service);
export const createPlanController: CreatePlanController = new CreatePlanController(createPlan);
