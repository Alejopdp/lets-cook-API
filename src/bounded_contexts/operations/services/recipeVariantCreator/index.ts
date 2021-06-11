import { mockIngredientRepository, mongooseIngredientRepository } from "../../infra/repositories/ingredient";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import {
    mockRecipeRestrictionRepository,
    mongooseRecipeVariantRestrictionRepository,
} from "../../infra/repositories/recipeVariantRestriction";
import { RecipeVariantCreator } from "./recipeVariantCreator";

export const recipeVariantCreator: RecipeVariantCreator = new RecipeVariantCreator(
    mongooseIngredientRepository,
    mongooseRecipeVariantRestrictionRepository
);
