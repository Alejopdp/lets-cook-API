import { v3S3Service } from "../../application/storageService";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetRecipeList } from "./getRecipeList";
import { GetRecipeListController } from "./getRecipeListController";

export const getRecipeList: GetRecipeList = new GetRecipeList(mongooseRecipeRepository, v3S3Service, mongooseWeekRepository);
export const getRecipeListController: GetRecipeListController = new GetRecipeListController(getRecipeList);
