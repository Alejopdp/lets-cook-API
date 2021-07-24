import { Mapper } from "../../../core/infra/Mapper";
import { Locale } from "../domain/locale/Locale";
import { RecipeSelection } from "../domain/order/RecipeSelection";
import { Recipe } from "../domain/recipe/Recipe";
import { RecipeVariantId } from "../domain/recipe/RecipeVariant/RecipeVariantId";
import { recipeMapper } from "./recipeMapper";

export class RecipeSelectionMapper implements Mapper<RecipeSelection> {
    public toDomain(raw: any, locale?: Locale): RecipeSelection {
        const recipe: Recipe = recipeMapper.toDomain(raw.recipe);

        return new RecipeSelection(recipe, raw.quantity, new RecipeVariantId(raw.recipeVariantId));
    }

    public toPersistence(t: RecipeSelection, locale?: Locale) {
        return {
            recipe: t.recipe.id.value,
            quantity: t.quantity,
            recipeVariantId: t.recipeVariantId.value,
        };
    }
}
