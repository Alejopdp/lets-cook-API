import { Ingredient } from "../../../domain/ingredient/ingredient";
import { Locale } from "../../../domain/locale/Locale";

export interface IIngredientRepository {
    save(ingredient: Ingredient): Promise<void>;
    findAll(locale: Locale): Promise<Ingredient[]>;
    findAllByName(names: string[], locale: Locale): Promise<Ingredient[]>;
    findByName(name: string, locale: Locale): Promise<Ingredient | undefined>;
    findBy(conditions: any, locale: Locale): Promise<Ingredient[]>;
    delete(name: string, locale: Locale): Promise<void>;
}
