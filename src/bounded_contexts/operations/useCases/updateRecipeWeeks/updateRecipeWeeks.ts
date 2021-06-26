import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { Week } from "../../domain/week/Week";
import { WeekId } from "../../domain/week/WeekId";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { UpdateRecipeWeeksDto } from "./updateRecipeWeeksDto";

export class UpdateRecipeWeeks {
    private _recipeRepository: IRecipeRepository;
    private _weekRepository: IWeekRepository;

    constructor(recipeRepository: IRecipeRepository, weekRepository: IWeekRepository) {
        this._recipeRepository = recipeRepository;
        this._weekRepository = weekRepository;
    }

    public async execute(dto: UpdateRecipeWeeksDto): Promise<void> {
        const recipeId: RecipeId = new RecipeId(dto.recipeId);
        //@ts-ignore
        const weeksIds: WeekId[] = dto.weeksIds.map((id: string | number) => new WeekId(id));
        const recipe: Recipe | undefined = await this.recipeRepository.findById(recipeId);
        const weeks: Week[] = await this.weekRepository.findAllById(weeksIds);

        if (!recipe) throw new Error("Receta no encontrada");

        recipe.updateWeeks(weeks);

        await this.recipeRepository.save(recipe);
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
