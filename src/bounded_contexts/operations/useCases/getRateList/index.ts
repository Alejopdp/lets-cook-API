import { v3S3Service } from "../../application/storageService";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { GetRateList } from "./getRateList";
import { GetRateListController } from "./getRateListController";

export const getRateList: GetRateList = new GetRateList(mongooseRateRepository, v3S3Service);
export const getRateListController: GetRateListController = new GetRateListController(getRateList);
