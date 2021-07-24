import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { WeekId } from "../../../domain/week/WeekId";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { Order } from "../../../domain/order/Order";

export interface IRecipeRepository {
    save(recipe: Recipe): Promise<void>;
    bulkSave(recipes: Recipe[]): Promise<void>;
    findAll(): Promise<Recipe[]>;
    findAllBackOfficeTags(): Promise<RecipeTag[]>;
    findById(recipeId: RecipeId): Promise<Recipe | undefined>;
    findByIdList(recipesIds: RecipeId[]): Promise<Recipe[]>;
    findBy(conditions: any): Promise<Recipe[]>;
    delete(recipeId: RecipeId): Promise<void>;
    findByWeekId(weekId: WeekId): Promise<Recipe[]>;
    findForOrder(order: Order, restrictionId?: RecipeRestrictionId): Promise<Recipe[]>;
}
