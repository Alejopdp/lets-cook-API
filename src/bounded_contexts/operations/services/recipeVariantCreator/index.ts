import { mongooseIngredientRepository } from "../../infra/repositories/ingredient";
import { mongooseRecipeVariantRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction";
import { RecipeVariantCreator } from "./recipeVariantCreator";

export const recipeVariantCreator: RecipeVariantCreator = new RecipeVariantCreator(
    mongooseIngredientRepository,
    mongooseRecipeVariantRestrictionRepository
);
