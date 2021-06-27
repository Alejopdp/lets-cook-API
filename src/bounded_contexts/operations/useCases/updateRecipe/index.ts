import { s3Service } from "../../application/storageService";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { recipeVariantCreator } from "../../services/recipeVariantCreator";
import { UpdateRecipe } from "./updateRecipe";
import { UpdateRecipeController } from "./updateRecipeController";

export const updateRecipe: UpdateRecipe = new UpdateRecipe(
    mongooseRecipeRepository,
    s3Service,
    mongooseWeekRepository,
    recipeVariantCreator
);
export const updateRecipeController = new UpdateRecipeController(updateRecipe);
