import { s3Service } from "../../application/storageService";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { UpdateRecipe } from "./updateRecipe";
import { UpdateRecipeController } from "./updateRecipeController";

export const updateRecipe: UpdateRecipe = new UpdateRecipe(mockRecipeRepository, s3Service);
export const updateRecipeController = new UpdateRecipeController(updateRecipe);
