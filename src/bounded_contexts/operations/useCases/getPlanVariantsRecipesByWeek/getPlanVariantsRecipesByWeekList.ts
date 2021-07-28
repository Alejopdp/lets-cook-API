import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetGetPlanVariantsRecipesByWeekListDto } from "./getPlanVariantsRecipesByWeekListDto";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { Week } from "../../domain/week/Week";
import { Recipe } from "../../domain/recipe/Recipe";
import { Locale } from "../../domain/locale/Locale";

export class GetPlanVariantsRecipesByWeekList {
    private _planRepository: IPlanRepository;
    private _weekRepository: IWeekRepository;
    private _recipeRepository: IRecipeRepository;

    constructor(planRepository: IPlanRepository, recipeRepository: IRecipeRepository, weekRepository: IWeekRepository) {
        this._planRepository = planRepository;
        this._recipeRepository = recipeRepository;
        this._weekRepository = weekRepository;
    }

    public async execute(): Promise<{ plans: Plan[]; recipes: Recipe[]; week: Week }> {
        const date_currently = new Date();
        // date_currently.setDate(date_currently.getDate() + 7);
        const week: Week | undefined = await this.weekRepository.findCurrentWeek(date_currently);
        if (!week) throw new Error("Error al obtener las recetas de la semana");

        const recipes: Recipe[] = await this.recipeRepository.findByWeekId(week.id);
        const plans: Plan[] = await this.planRepository.findAll((<any>Locale)["es" as string] || Locale.es);

        return { plans, recipes, week };
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

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}
