import { s3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetPlanById } from "./getPlanById";
import { GetPlanByIdController } from "./getPlanByIdController";

// export const getPlanById: GetPlanById = new GetPlanById(mockPlanRepository, s3Service);
export const getPlanById: GetPlanById = new GetPlanById(mongoosePlanRepository, s3Service);
export const getPlanByIdController: GetPlanByIdController = new GetPlanByIdController(getPlanById);
