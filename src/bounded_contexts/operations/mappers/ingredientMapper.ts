import { Mapper } from "../../../core/infra/Mapper";
import { Ingredient } from "../domain/ingredient/ingredient";
import { Locale } from "../domain/locale/Locale";

export class IngredientMapper implements Mapper<Ingredient> {
    public toDomain(raw: any, locale?: Locale): Ingredient {
        return new Ingredient(raw.name);
    }

    public toPersistence(t: Ingredient, locale?: Locale) {
        return {
            name: t.name,
        };
    }
}
