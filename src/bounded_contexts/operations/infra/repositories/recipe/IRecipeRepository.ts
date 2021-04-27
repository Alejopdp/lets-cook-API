import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeId } from "../../../domain/recipe/RecipeId";

export interface IRecipeRepository {
    save(recipe: Recipe): Promise<void>;
    findAll(): Promise<Recipe[]>;
    findById(recipeId: RecipeId): Promise<Recipe | undefined>;
    findBy(conditions: any): Promise<Recipe[]>;
    delete(recipeId: RecipeId): Promise<void>;
}
