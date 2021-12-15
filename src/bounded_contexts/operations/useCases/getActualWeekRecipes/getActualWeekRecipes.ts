import { Recipe } from "../../domain/recipe/Recipe";
import { Week } from "../../domain/week/Week";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetActualWeekRecipesDto } from "./getActualWeekRecipesDto";

export class GetActualWeekRecipes {
    private _weekRepository: IWeekRepository;
    private _recipeRepository: IRecipeRepository;

    constructor(weekRepository: IWeekRepository, recipeRepository: IRecipeRepository) {
        this._weekRepository = weekRepository;
        this._recipeRepository = recipeRepository;
    }

    public async execute(dto: GetActualWeekRecipesDto): Promise<Recipe[]> {
        const actualWeek: Week | undefined = await this.weekRepository.findActualWeek();
        if (!!!actualWeek) throw new Error("Error al obtener las recetas de esta semana");
        const recipes: Recipe[] = await this.recipeRepository.findByWeekId(actualWeek.id, dto.locale);

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
