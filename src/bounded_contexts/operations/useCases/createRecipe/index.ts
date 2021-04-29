import { s3Service } from "../../application/storageService";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { mockWeekRepository } from "../../infra/repositories/week";
import { CreateRecipe } from "./createRecipe";
import { CreateRecipeController } from "./createRecipeController";

export const createRecipe: CreateRecipe = new CreateRecipe(mockRecipeRepository, s3Service, mockWeekRepository);
export const createRecipeController: CreateRecipeController = new CreateRecipeController(createRecipe);
