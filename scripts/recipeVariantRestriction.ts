import { RecipeRestrictionId } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export const getMockRecipeVartiantRestrictions = () => {
    const sinGluten = new RecipeVariantRestriction("Sin gluten", "sinGluten");
    const sinLactosa = new RecipeVariantRestriction("Sin lactosa", "sinLactosa");
    const vegano = new RecipeVariantRestriction("Apto vegano", "vegano");
    const Vegetariano = new RecipeVariantRestriction("Apto vegetariano", "vegetariano");

    return [sinGluten, sinLactosa, vegano, Vegetariano];
};
