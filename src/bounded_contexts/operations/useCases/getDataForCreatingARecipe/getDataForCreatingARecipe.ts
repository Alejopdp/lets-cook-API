import { Ingredient } from "../../domain/ingredient/ingredient";
import { Plan } from "../../domain/plan/Plan";
import { Month } from "../../domain/recipe/Months";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { Week } from "../../domain/week/Week";
import { IIngredientRepository } from "../../infra/repositories/ingredient/IIngredientRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { IRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction/IRecipeRestrictionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetDataForCreatingARecipeDto } from "./getDataForCreatingARecipeDto";
import { GetDataForCreatingARecipePresenter } from "./getDataForCreatingARecipePresenter";

export class GetDataForCreatingARecipe {
    private _planRepository: IPlanRepository;
    private _ingredientRepository: IIngredientRepository;
    private _weekRepository: IWeekRepository;
    private _recipeRestrictionRepository: IRecipeRestrictionRepository;

    constructor(
        planRepository: IPlanRepository,
        ingredientRepository: IIngredientRepository,
        weekRepository: IWeekRepository,
        recipeRestrictionRepository: IRecipeRestrictionRepository
    ) {
        this._planRepository = planRepository;
        this._ingredientRepository = ingredientRepository;
        this._weekRepository = weekRepository;
        this._recipeRestrictionRepository = recipeRestrictionRepository;
    }

    public async execute(dto: GetDataForCreatingARecipeDto): Promise<any> {
        const plans: Plan[] = await this.planRepository.findAllWithRecipesFlag(dto.locale);
        const ingredients: Ingredient[] = await this.ingredientRepository.findAll(dto.locale);
        const weeks: Week[] = await this.weekRepository.findNextTwelve(false); // TO DO
        const months: Month[] = [
            Month.Enero,
            Month.Febrero,
            Month.Marzo,
            Month.Abril,
            Month.Mayo,
            Month.Junio,
            Month.Julio,
            Month.Agosto,
            Month.Septiembre,
            Month.Octubre,
            Month.Noviembre,
            Month.Diciembre,
        ];
        const restrictions: RecipeVariantRestriction[] = await this.recipeRestrictionRepository.findAll();

        return GetDataForCreatingARecipePresenter.present(plans, ingredients, weeks, months, restrictions);
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

    /**
     * Getter recipeRestrictionRepository
     * @return {IRecipeRestrictionRepository}
     */
    public get recipeRestrictionRepository(): IRecipeRestrictionRepository {
        return this._recipeRestrictionRepository;
    }
}
