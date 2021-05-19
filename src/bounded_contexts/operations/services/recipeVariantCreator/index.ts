import { mockIngredientRepository } from "../../infra/repositories/ingredient";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { mockRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction";
import { RecipeVariantCreator } from "./recipeVariantCreator";

export const recipeVariantCreator: RecipeVariantCreator = new RecipeVariantCreator(
    mockIngredientRepository,
    mockRecipeRestrictionRepository
);
