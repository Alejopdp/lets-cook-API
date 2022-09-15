import { Mapper } from "../../../core/infra/Mapper";
import { Locale } from "../domain/locale/Locale";
import { RecipeRestrictionId } from "../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export class RecipeRestrictionsMapper implements Mapper<RecipeVariantRestriction, any> {
    public toDomain(raw: any, locale?: Locale): RecipeVariantRestriction {
        return new RecipeVariantRestriction(raw.label, raw.value, new RecipeRestrictionId(raw._id));
    }

    public toPersistence(t: RecipeVariantRestriction, locale?: Locale) {
        return {
            label: t.label,
            value: t.value,
            _id: t.id.value,
        };
    }
}
