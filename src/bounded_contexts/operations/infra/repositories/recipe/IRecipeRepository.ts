import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { WeekId } from "../../../domain/week/WeekId";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { Order } from "../../../domain/order/Order";
import { RecipeVariantSku } from "@src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariantSku";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";

export interface IRecipeRepository {
    save(recipe: Recipe, locale?: Locale): Promise<void>;
    bulkSave(recipes: Recipe[]): Promise<void>;
    findAll(locale?: Locale): Promise<Recipe[]>;
    findAllBackOfficeTags(locale?: Locale): Promise<RecipeTag[]>;
    findById(recipeId: RecipeId, locale?: Locale): Promise<Recipe | undefined>;
    findByIdList(recipesIds: RecipeId[], locale?: Locale): Promise<Recipe[]>;
    findBy(conditions: any, locale?: Locale): Promise<Recipe[]>;
    delete(recipeId: RecipeId): Promise<void>;
    findByWeekId(weekId: WeekId, locale?: Locale): Promise<Recipe[]>;
    findAllAvailableOnWeeks(weeksIds: WeekId[], locale?: Locale): Promise<Recipe[]>;
    findForOrder(order: Order, restrictionId?: RecipeRestrictionId, locale?: Locale): Promise<Recipe[]>;
    findByRecipeVariantSkuList(recipeVariantSkus: RecipeVariantSku[], locale?: Locale): Promise<Recipe[]>;
    findNextWeekRecipes(locale?: Locale): Promise<Recipe[]>;
    findByRecipeVariantSkuOrThrow(recipeVariantSku: string, locale: Locale): Promise<Recipe>;
}
