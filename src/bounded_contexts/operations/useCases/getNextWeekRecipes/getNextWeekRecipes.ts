import { Recipe } from "../../domain/recipe/Recipe";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";

export class GetNextWeekRecipes {
    private _recipeRepository: IRecipeRepository;

    constructor(recipeRepository: IRecipeRepository) {
        this._recipeRepository = recipeRepository;
    }

    public async execute(): Promise<Recipe[]> {
        const recipes: Recipe[] = await this.recipeRepository.findNextWeekRecipes();

        return recipes;
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }
}
