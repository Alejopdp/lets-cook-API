import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";

export interface IRecipeRepository {
    save(recipe: Recipe): Promise<void>;
    bulkSave(recipes: Recipe[]): Promise<void>;
    findAll(): Promise<Recipe[]>;
    findAllBackOfficeTags(): Promise<RecipeTag[]>;
    findById(recipeId: RecipeId): Promise<Recipe | undefined>;
    findBy(conditions: any): Promise<Recipe[]>;
    delete(recipeId: RecipeId): Promise<void>;
}
