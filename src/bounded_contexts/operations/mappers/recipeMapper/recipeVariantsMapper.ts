import { recipeRestrictionMapper } from ".";
import { Mapper } from "../../../../core/infra/Mapper";
import { Ingredient } from "../../domain/ingredient/ingredient";
import { Locale } from "../../domain/locale/Locale";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export class RecipeVariantsMapper implements Mapper<RecipeVariant> {
    public toDomain(raw: any, locale?: Locale): RecipeVariant {
        const ingredients: Ingredient[] = raw.ingredients.map((ing: any) => new Ingredient(ing));
        const recipeRestrictions: RecipeVariantRestriction[] = raw.restrictions.map((restriction: any) =>
            recipeRestrictionMapper.toDomain(restriction)
        );

        return new RecipeVariant(ingredients, recipeRestrictions, raw.sku);
    }
    public toPersistence(t: RecipeVariant, locale?: Locale) {
        return {
            ingredients: t.ingredients.map((ing) => ing.name),
            restrictions: t.recipeVariantRestriction.map((r) => recipeRestrictionMapper.toPersistence(r)),
            sku: t.sku.code,
        };
    }
}
