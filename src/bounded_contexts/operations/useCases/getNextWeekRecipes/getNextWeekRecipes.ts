import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";

export class GetNextWeekRecipes {
    private _weekRepository: IWeekRepository;
    private _recipeRepository: IRecipeRepository;

    constructor(weekRepository: IWeekRepository, recipeRepository: IRecipeRepository) {
        this._weekRepository = weekRepository;
        this._recipeRepository = recipeRepository;
    }

    public async execute(): Promise<Recipe[]> {
        const nextWeek: Week | undefined = await this.weekRepository.findNextWeek();
        if (!!!nextWeek) throw new Error("Error al obtener las recetas de la semana que viene");
        const recipes: Recipe[] = await this.recipeRepository.findByWeekId(nextWeek.id);

        return recipes;
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}
