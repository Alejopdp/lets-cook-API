import { Mapper } from "../../../../core/infra/Mapper";
import { Locale } from "../../domain/locale/Locale";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export class RecipeRestrictionsMapper implements Mapper<RecipeVariantRestriction> {
    public toDomain(raw: any, locale?: Locale): RecipeVariantRestriction {
        return new RecipeVariantRestriction(raw.label, raw.value);
    }
    public toPersistence(t: RecipeVariantRestriction, locale?: Locale) {
        return {
            label: t.label,
            value: t.value,
        };
    }
}
