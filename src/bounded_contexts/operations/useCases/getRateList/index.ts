import { v3S3Service } from "../../application/storageService";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { GetRateList } from "./getRateList";
import { GetRateListController } from "./getRateListController";
import { GetRateListPresenter } from "./getRateListPresenter";

export const getRateListPresenter: GetRateListPresenter = new GetRateListPresenter(v3S3Service);
export const getRateList: GetRateList = new GetRateList(mongooseRateRepository, getRateListPresenter);
export const getRateListController: GetRateListController = new GetRateListController(getRateList);
