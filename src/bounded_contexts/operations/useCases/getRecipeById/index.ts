import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { GetRecipeById } from "./getRecipeById";
import { GetRecipeByIdController } from "./getRecipeByIdController";

export const getRecipeById: GetRecipeById = new GetRecipeById(mockRecipeRepository);
export const getRecipeByIdController: GetRecipeByIdController = new GetRecipeByIdController(getRecipeById);
