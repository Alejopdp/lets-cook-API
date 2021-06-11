import { Ingredient } from "../src/bounded_contexts/operations/domain/ingredient/ingredient";

export const getIngredients = (): Ingredient[] => {
    const ingredientList: string[] = ["Lechuga", "Tomate", "Cebolla", "Pollo", "Cerdo", "Carne", "Queso", "Pan", "Ajo", "Jamón"];

    return ingredientList.map((ing) => new Ingredient(ing));
};
