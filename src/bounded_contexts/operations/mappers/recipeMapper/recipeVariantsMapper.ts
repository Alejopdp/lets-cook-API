import { recipeRestrictionMapper } from "..";
import { Mapper } from "../../../../core/infra/Mapper";
import { Ingredient } from "../../domain/ingredient/ingredient";
import { Locale } from "../../domain/locale/Locale";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "../../domain/recipe/RecipeVariant/RecipeVariantSku";

export class RecipeVariantsMapper implements Mapper<RecipeVariant> {
    public toDomain(raw: any, locale?: Locale): RecipeVariant {
        const ingredients: Ingredient[] = raw.ingredients.map((ing: any) => new Ingredient(ing));
        const recipeRestrictions: RecipeVariantRestriction = recipeRestrictionMapper.toDomain(raw.restriction);

        return new RecipeVariant(ingredients, recipeRestrictions, new RecipeVariantSku(raw.sku));
    }
    public toPersistence(t: RecipeVariant, locale?: Locale) {
        return {
            ingredients: t.ingredients.map((ing) => ing.name),
            restriction: recipeRestrictionMapper.toPersistence(t.restriction),
            sku: t.sku.code,
        };
    }
}
