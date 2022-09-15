import { ingredientMapper, recipeRestrictionMapper } from "..";
import { Mapper } from "../../../../core/infra/Mapper";
import { Ingredient } from "../../domain/ingredient/ingredient";
import { Locale } from "../../domain/locale/Locale";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "../../domain/recipe/RecipeVariant/RecipeVariantSku";

export interface DatabaseRecipeVariant {
    ingredients: (string | number)[]
    restriction: string | number
    sku: string
}
export class RecipeVariantsMapper implements Mapper<RecipeVariant, DatabaseRecipeVariant> {
    public toDomain(raw: any, locale?: Locale): RecipeVariant {
        const ingredients: Ingredient[] = raw.ingredients.map((ingredient: any) =>
            ingredientMapper.toDomain(ingredient, locale || Locale.es)
        );
        const recipeRestriction: RecipeVariantRestriction = recipeRestrictionMapper.toDomain(raw.restriction);

        return new RecipeVariant(ingredients, recipeRestriction, new RecipeVariantSku(raw.sku));
    }
    public toPersistence(t: RecipeVariant, locale?: Locale): DatabaseRecipeVariant {
        return {
            ingredients: t.ingredients.map((ing) => ing.id.value),
            restriction: t.restriction.id.value,
            sku: t.sku.code,
        };
    }
}
