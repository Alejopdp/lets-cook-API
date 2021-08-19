import { Mapper } from "../../../core/infra/Mapper";
import { Ingredient } from "../domain/ingredient/ingredient";
import { Locale } from "../domain/locale/Locale";

export class IngredientMapper implements Mapper<Ingredient> {
    public toDomain(raw: any, locale: Locale = Locale.es): Ingredient {
        return new Ingredient(raw.name[locale], raw._id);
    }

    public toPersistence(t: Ingredient, locale: Locale = Locale.es) {
        return {
            name: { [locale]: t.name },
            _id: t.id.value,
        };
    }
}
