import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { MockRecipeRestrictionRepository } from "./mockRecipeRestrictionRepository";
import { MongooseRecipeVariantRestrictionRepository } from "./mongooseRecipeRestrictionRepository";
import { aptoVegano, sinGluten, sinLactosa, aptoTodo } from "../../../../../../tests/mocks/retrictions"

const database: RecipeVariantRestriction[] = [];

database.push(sinGluten);
database.push(sinLactosa);
database.push(aptoVegano);
database.push(aptoTodo);

export const mockRecipeRestrictionRepository: MockRecipeRestrictionRepository = new MockRecipeRestrictionRepository(database);
export const mongooseRecipeVariantRestrictionRepository: MongooseRecipeVariantRestrictionRepository =
    new MongooseRecipeVariantRestrictionRepository();
