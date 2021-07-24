import { Locale } from "../../../domain/locale/Locale";
import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export interface IRecipeRestrictionRepository {
    save(recipe: RecipeVariantRestriction): Promise<void>;
    bulkSave(recipeVariantRestrictions: RecipeVariantRestriction[]): Promise<void>;
    findAll(): Promise<RecipeVariantRestriction[]>;
    findAllByValue(value: string): Promise<RecipeVariantRestriction[]>;
    findById(recipeRestrictionId: RecipeRestrictionId, locale: Locale): Promise<RecipeVariantRestriction | undefined>;
    findByIdOrThrow(recipeRestrictionId: RecipeRestrictionId, locale: Locale): Promise<RecipeVariantRestriction>;
    findBy(conditions: any): Promise<RecipeVariantRestriction[]>;
    delete(recipeId: RecipeRestrictionId): Promise<void>;
}
