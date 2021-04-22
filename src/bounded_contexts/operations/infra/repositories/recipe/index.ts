import { Recipe } from "../../../domain/recipe/Recipe";
import { IRecipeRepository } from "./IRecipeRepository";
import { MockRecipeRepository } from "./mockRecipeRepository";

const mockDatabase: Recipe[] = [];
export const mockRecipeRepository: IRecipeRepository = new MockRecipeRepository(mockDatabase);
