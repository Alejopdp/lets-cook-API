import { RecipeRestrictionId } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export const getMockRecipeVartiantRestrictions = () => {
    const sinGluten = new RecipeVariantRestriction("Sin gluten", "sinGluten");
    const sinLactosa = new RecipeVariantRestriction("Sin lactosa", "sinLactosa");
    const vegano = new RecipeVariantRestriction("Apto vegano", "vegano");
    const aptoVeganoSinGluten = new RecipeVariantRestriction("Apto vegano sin gluten", "Apto vegano sin gluten");
    const sinGlutenSinLactosa = new RecipeVariantRestriction("Sin gluten y lactosa", "Sin gluten y lactosa");
    const aptoTodo = new RecipeVariantRestriction("Apto todo", "apto_todo");

    return [sinGluten, sinLactosa, vegano, aptoVeganoSinGluten, sinGlutenSinLactosa, aptoTodo];
};
