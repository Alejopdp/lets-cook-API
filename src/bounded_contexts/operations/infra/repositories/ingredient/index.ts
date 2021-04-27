import { Ingredient } from "../../../domain/ingredient/ingredient";
import { IIngredientRepository } from "./IIngredientRepository";
import { MockIngredientRepository } from "./mockIngredientRepository";

const lechuga: Ingredient = new Ingredient("Lechuga");
const tomate: Ingredient = new Ingredient("Tomate");
const cebolla: Ingredient = new Ingredient("Cebolla");
const pollo: Ingredient = new Ingredient("Pollo");
const cerdo: Ingredient = new Ingredient("Cerdo");
const carne: Ingredient = new Ingredient("Carne");
const queso: Ingredient = new Ingredient("Queso");
const pan: Ingredient = new Ingredient("Pan");
const ajo: Ingredient = new Ingredient("Ajo");
const jamon: Ingredient = new Ingredient("Jamón");

const mockDatabase: Ingredient[] = [lechuga, tomate, cebolla, pollo, cerdo, carne, queso, pan, ajo, jamon];
export const mockIngredientRepository: IIngredientRepository = new MockIngredientRepository(mockDatabase);
