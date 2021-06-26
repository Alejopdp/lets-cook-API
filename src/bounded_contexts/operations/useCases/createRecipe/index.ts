import { s3Service } from "../../application/storageService";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { recipeVariantCreator } from "../../services/recipeVariantCreator";
import { CreateRecipe } from "./createRecipe";
import { CreateRecipeController } from "./createRecipeController";

// export const createRecipe: CreateRecipe = new CreateRecipe(mockRecipeRepository, s3Service, mockWeekRepository, recipeVariantCreator);
export const createRecipe: CreateRecipe = new CreateRecipe(
    mongooseRecipeRepository,
    s3Service,
    mongooseWeekRepository,
    recipeVariantCreator
);
export const createRecipeController: CreateRecipeController = new CreateRecipeController(createRecipe);
