import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { GetRecipeList } from "./getRecipeList";
import { GetRecipeListController } from "./getRecipeListController";

export const getRecipeList: GetRecipeList = new GetRecipeList(mockRecipeRepository);
export const getRecipeListController: GetRecipeListController = new GetRecipeListController(getRecipeList);
