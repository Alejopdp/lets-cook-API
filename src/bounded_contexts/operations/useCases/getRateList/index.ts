import { s3Service } from "../../application/storageService";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { GetRateList } from "./getRateList";
import { GetRateListController } from "./getRateListController";

// export const getRecipeList: GetRecipeList = new GetRecipeList(mockRecipeRepository, s3Service);
export const getRateList: GetRateList = new GetRateList(mongooseRateRepository, s3Service);
export const getRateListController: GetRateListController = new GetRateListController(getRateList);
