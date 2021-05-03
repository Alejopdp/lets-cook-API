import { Plan } from "../../domain/plan/Plan";
import { RecipeTag } from "../../domain/recipe/RecipeTag";
import { Week } from "../../domain/week/Week";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetRecipeFiltersPresenter } from "./getRecipeFiltersPresenter";

export class GetRecipeFilters {
    private _weekRepository: IWeekRepository;
    private _planRepository: IPlanRepository;
    private _recipeRepository: IRecipeRepository;

    constructor(weekRepository: IWeekRepository, planRepository: IPlanRepository, recipeRepository: IRecipeRepository) {
        this._weekRepository = weekRepository;
        this._planRepository = planRepository;
        this._recipeRepository = recipeRepository;
    }

    public async execute(): Promise<any> {
        const weeks: Week[] = await this.weekRepository.findAll();
        const plansWithRecipes: Plan[] = await this.planRepository.findAllWithRecipesFlag();
        const backOfficeTags: RecipeTag[] = await this.recipeRepository.findAllBackOfficeTags();

        return GetRecipeFiltersPresenter.present(weeks, plansWithRecipes, backOfficeTags);
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }
}
