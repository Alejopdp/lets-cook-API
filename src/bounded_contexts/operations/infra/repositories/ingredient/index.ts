import { Ingredient } from "../../../domain/ingredient/ingredient";
import { IIngredientRepository } from "./IIngredientRepository";
import { MockIngredientRepository } from "./mockIngredientRepository";

const mockDatabase: Ingredient[] = [];
export const mockIngredientRepository: IIngredientRepository = new MockIngredientRepository(mockDatabase);
