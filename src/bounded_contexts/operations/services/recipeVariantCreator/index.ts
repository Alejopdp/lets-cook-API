import { mockIngredientRepository } from "../../infra/repositories/ingredient";
import { RecipeVariantCreator } from "./recipeVariantCreator";

export const recipeVariantCreator: RecipeVariantCreator = new RecipeVariantCreator(mockIngredientRepository);
