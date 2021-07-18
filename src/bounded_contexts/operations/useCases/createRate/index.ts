import { s3Service } from "../../application/storageService";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { CreateRate } from "./createRate";
import { CreateRateController } from "./createRateController";

export const createRate: CreateRate = new CreateRate(mongooseRateRepository, s3Service);
export const createRateController: CreateRateController = new CreateRateController(createRate);
