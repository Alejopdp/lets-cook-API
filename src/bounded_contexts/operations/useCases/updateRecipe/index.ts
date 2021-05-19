import { s3Service } from "../../application/storageService";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { mockWeekRepository } from "../../infra/repositories/week";
import { recipeVariantCreator } from "../../services/recipeVariantCreator";
import { UpdateRecipe } from "./updateRecipe";
import { UpdateRecipeController } from "./updateRecipeController";

export const updateRecipe: UpdateRecipe = new UpdateRecipe(mockRecipeRepository, s3Service, mockWeekRepository, recipeVariantCreator);
export const updateRecipeController = new UpdateRecipeController(updateRecipe);
