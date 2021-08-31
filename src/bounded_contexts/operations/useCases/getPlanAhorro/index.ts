import { s3Service } from "../../application/storageService";
// import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongoosePlanRepository } from "../../infra/repositories/plan/index";
import { GetPlanAhorro } from "./getPlanAhorro";
import { GetPlanAhorroController } from "./getPlanAhorroController";
import { GetPlanAhorroPresenter } from "./getPlanAhorroPresenter";

export const getPlanAhorro: GetPlanAhorro = new GetPlanAhorro(mongoosePlanRepository);
export const getPlanAhorroPresenter: GetPlanAhorroPresenter = new GetPlanAhorroPresenter(s3Service);
export const getPlanAhorroController: GetPlanAhorroController = new GetPlanAhorroController(getPlanAhorro, getPlanAhorroPresenter);
