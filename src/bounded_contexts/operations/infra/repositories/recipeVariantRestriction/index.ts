import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { MockRecipeRestrictionRepository } from "./mockRecipeRestrictionRepository";
import { MongooseRecipeVariantRestrictionRepository } from "./mongooseRecipeRestrictionRepository";

const database: RecipeVariantRestriction[] = [];

export const sinGluten = new RecipeVariantRestriction("Sin gluten", "sinGluten", new RecipeRestrictionId("1"));
export const sinLactosa = new RecipeVariantRestriction("Sin lactosa", "sinLactosa", new RecipeRestrictionId("2"));
export const vegano = new RecipeVariantRestriction("Apto vegano", "vegano", new RecipeRestrictionId("2"));
export const Vegetariano = new RecipeVariantRestriction("Apto vegetariano", "vegetariano", new RecipeRestrictionId("4"));

database.push(sinGluten);
database.push(sinLactosa);
database.push(vegano);
database.push(Vegetariano);

export const mockRecipeRestrictionRepository: MockRecipeRestrictionRepository = new MockRecipeRestrictionRepository(database);
export const mongooseRecipeVariantRestrictionRepository: MongooseRecipeVariantRestrictionRepository =
    new MongooseRecipeVariantRestrictionRepository();
