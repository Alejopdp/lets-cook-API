import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { DeleteRecipe } from "./deleteRecipe";
import { DeleteRecipeController } from "./deleteRecipeController";

export const deleteRecipe: DeleteRecipe = new DeleteRecipe(mockRecipeRepository);
export const deleteRecipeController: DeleteRecipeController = new DeleteRecipeController(deleteRecipe);
