import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { IRecipeRepository } from "./IRecipeRepository";

export class MockRecipeRepository implements IRecipeRepository {
    private _database: Recipe[];

    constructor(database: Recipe[]) {
        this._database = database;
    }

    public async save(recipe: Recipe): Promise<void> {
        const filteredDatabase = this.database.filter((r) => !recipe.equals(r));

        this.database = [...filteredDatabase, recipe];
    }

    public async findById(recipeId: RecipeId): Promise<Recipe | undefined> {
        return this.database.find((r) => r.id.equals(recipeId));
    }

    public async findAll(): Promise<Recipe[]> {
        return this.database;
    }

    public async findBy(conditions: any): Promise<Recipe[]> {
        throw new Error("Method not implemented.");
    }

    public async delete(recipeId: RecipeId): Promise<void> {
        this.database = this.database.filter((r) => r.id.equals(recipeId));
    }

    /**
     * Getter database
     * @return {Recipe[]}
     */
    public get database(): Recipe[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {Recipe[]} value
     */
    public set database(value: Recipe[]) {
        this._database = value;
    }
}
