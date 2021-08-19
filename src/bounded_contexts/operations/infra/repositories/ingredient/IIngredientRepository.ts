import { Ingredient } from "../../../domain/ingredient/ingredient";
import { Locale } from "../../../domain/locale/Locale";

export interface IIngredientRepository {
    save(ingredient: Ingredient): Promise<void>;
    findAll(): Promise<Ingredient[]>;
    findAllByName(names: string[], locale: Locale): Promise<Ingredient[]>;
    findByName(name: string): Promise<Ingredient | undefined>;
    findBy(conditions: any): Promise<Ingredient[]>;
    delete(name: string): Promise<void>;
}
