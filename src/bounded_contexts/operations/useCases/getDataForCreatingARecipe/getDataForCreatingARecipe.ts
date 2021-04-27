import { Ingredient } from "../../domain/ingredient/ingredient";
import { Plan } from "../../domain/plan/Plan";
import { IIngredientRepository } from "../../infra/repositories/ingredient/IIngredientRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetDataForCreatingARecipePresenter } from "./getDataForCreatingARecipePresenter";

export class GetDataForCreatingARecipe {
    private _planRepository: IPlanRepository;
    private _ingredientRepository: IIngredientRepository;

    constructor(planRepository: IPlanRepository, ingredientRepository: IIngredientRepository) {
        this._planRepository = planRepository;
        this._ingredientRepository = ingredientRepository;
    }

    public async execute(): Promise<any> {
        const plans: Plan[] = await this.planRepository.findAllWithRecipesFlag();
        const ingredients: Ingredient[] = await this.ingredientRepository.findAll();

        return GetDataForCreatingARecipePresenter.present(plans, ingredients);
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
}
