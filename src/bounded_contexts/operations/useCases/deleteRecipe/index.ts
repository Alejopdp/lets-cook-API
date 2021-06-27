import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { DeleteRecipe } from "./deleteRecipe";
import { DeleteRecipeController } from "./deleteRecipeController";

// export const deleteRecipe: DeleteRecipe = new DeleteRecipe(mockRecipeRepository);
export const deleteRecipe: DeleteRecipe = new DeleteRecipe(mongooseRecipeRepository);
export const deleteRecipeController: DeleteRecipeController = new DeleteRecipeController(deleteRecipe);
