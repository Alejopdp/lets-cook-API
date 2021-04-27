import { s3Service } from "../../application/storageService";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { CreateRecipe } from "./createRecipe";
import { CreateRecipeController } from "./createRecipeController";

export const createRecipe: CreateRecipe = new CreateRecipe(mockRecipeRepository, s3Service);
export const createRecipeController: CreateRecipeController = new CreateRecipeController(createRecipe);
