import { Ingredient } from "../../../domain/ingredient/ingredient";

export interface IIngredientRepository {
    save(ingredient: Ingredient): Promise<void>;
    findAll(): Promise<Ingredient[]>;
    findByName(name: string): Promise<Ingredient | undefined>;
    findBy(conditions: any): Promise<Ingredient[]>;
    delete(name: string): Promise<void>;
}
