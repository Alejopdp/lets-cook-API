import { v3S3Service } from "../../application/storageService";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { UpdateRate } from "./updateRate";
import { UpdateRateController } from "./updateRateController";

export const updateRate: UpdateRate = new UpdateRate(mongooseRateRepository, v3S3Service);
export const updateRateController: UpdateRateController = new UpdateRateController(updateRate);
