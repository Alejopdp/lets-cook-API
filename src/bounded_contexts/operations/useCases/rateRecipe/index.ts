import { RateRecipe } from "./rateRecipe";
import { RateRecipeController } from "./rateRecipeController";

export const rateRecipe: RateRecipe = new RateRecipe();
export const rateRecipeController: RateRecipeController = new RateRecipeController(rateRecipe);
