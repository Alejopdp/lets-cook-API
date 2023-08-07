import { RecipeVariantRestriction } from "../../src/bounded_contexts/operations/domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export const sinLactosa: RecipeVariantRestriction = new RecipeVariantRestriction("Sin lactosa", "sinLactosa")
export const aptoVeganoSinGluten: RecipeVariantRestriction = new RecipeVariantRestriction("Apto vegano sin gluten", "Apto vegano sin gluten")
export const aptoVegano: RecipeVariantRestriction = new RecipeVariantRestriction("Apto vegano", "vegano")
export const sinGluten: RecipeVariantRestriction = new RecipeVariantRestriction("Sin gluten", "sinGluten")
export const sinGlutenYLactosa: RecipeVariantRestriction = new RecipeVariantRestriction("Sin gluten y lactosa", "Sin gluten y lactosa")
export const aptoTodo: RecipeVariantRestriction = new RecipeVariantRestriction("Apto todo", "apto_todo")