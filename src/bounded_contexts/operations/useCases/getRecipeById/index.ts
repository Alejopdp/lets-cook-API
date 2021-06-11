import { mockRecipeRepository, mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { GetRecipeById } from "./getRecipeById";
import { GetRecipeByIdController } from "./getRecipeByIdController";

export const getRecipeById: GetRecipeById = new GetRecipeById(mongooseRecipeRepository);
export const getRecipeByIdController: GetRecipeByIdController = new GetRecipeByIdController(getRecipeById);
