import { v3S3Service } from "../../application/storageService";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetPlanById } from "./getPlanById";
import { GetPlanByIdController } from "./getPlanByIdController";
import { GetPlanByIdPresenter } from "./getPlanByIdPresenter";

export const getPlanById: GetPlanById = new GetPlanById(mongoosePlanRepository);
export const getPlanByIdPresenter: GetPlanByIdPresenter = new GetPlanByIdPresenter(v3S3Service);
export const getPlanByIdController: GetPlanByIdController = new GetPlanByIdController(getPlanById, getPlanByIdPresenter);
