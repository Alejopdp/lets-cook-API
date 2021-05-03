import { Ingredient } from "../../domain/ingredient/ingredient";
import { Plan } from "../../domain/plan/Plan";
import { Week } from "../../domain/week/Week";
import { IIngredientRepository } from "../../infra/repositories/ingredient/IIngredientRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetDataForCreatingARecipePresenter } from "./getDataForCreatingARecipePresenter";

export class GetDataForCreatingARecipe {
    private _planRepository: IPlanRepository;
    private _ingredientRepository: IIngredientRepository;
    private _weekRepository: IWeekRepository;

    constructor(planRepository: IPlanRepository, ingredientRepository: IIngredientRepository, weekRepository: IWeekRepository) {
        this._planRepository = planRepository;
        this._ingredientRepository = ingredientRepository;
        this._weekRepository = weekRepository;
    }

    public async execute(): Promise<any> {
        const plans: Plan[] = await this.planRepository.findAllWithRecipesFlag();
        const ingredients: Ingredient[] = await this.ingredientRepository.findAll();
        const weeks: Week[] = await this.weekRepository.findAll();

        return GetDataForCreatingARecipePresenter.present(plans, ingredients, weeks);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    private get planRepository(): IPlanRepository {
        return this._planRepository;
    }

    /**
     * Getter ingredientRepository
     * @return {IIngredientRepository}
     */
    public get ingredientRepository(): IIngredientRepository {
        return this._ingredientRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}
