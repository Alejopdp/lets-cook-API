import { v3S3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { CreatePlan } from "./createPlan";
import { CreatePlanController } from "./createPlanController";

export const createPlan: CreatePlan = new CreatePlan(mongoosePlanRepository, v3S3Service);
export const createPlanController: CreatePlanController = new CreatePlanController(createPlan);
