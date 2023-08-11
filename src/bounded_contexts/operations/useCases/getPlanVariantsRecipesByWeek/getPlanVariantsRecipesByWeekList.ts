import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetPlanVariantsRecipesByWeekListDto } from "./getPlanVariantsRecipesByWeekListDto";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { Week } from "../../domain/week/Week";
import { Recipe } from "../../domain/recipe/Recipe";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { CustomerId } from "../../domain/customer/CustomerId";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";

export class GetPlanVariantsRecipesByWeekList {
    private _planRepository: IPlanRepository;
    private _weekRepository: IWeekRepository;
    private _recipeRepository: IRecipeRepository;
    private _recipeRatingRepository: IRateRepository;

    constructor(planRepository: IPlanRepository, recipeRepository: IRecipeRepository, weekRepository: IWeekRepository, recipeRatingRepository: IRateRepository) {
        this._planRepository = planRepository;
        this._recipeRepository = recipeRepository;
        this._weekRepository = weekRepository;
        this._recipeRatingRepository = recipeRatingRepository;
    }

    public async execute(dto: GetPlanVariantsRecipesByWeekListDto): Promise<{ plans: Plan[]; recipes: Recipe[]; week: Week, averageRecipeRatingsMap: Map<string, number>, userRatings: RecipeRating[] }> {
        const date_currently = new Date();
        date_currently.setDate(date_currently.getDate() + (date_currently.getDay() === 0 ? 14 : 7));
        const week: Week | undefined = await this.weekRepository.findCurrentWeek(date_currently);
        if (!week) throw new Error("Error al obtener las recetas de la semana");

        const recipes: Recipe[] = await this.recipeRepository.findByWeekId(week.id, dto.locale);
        const plans: Plan[] = await this.planRepository.findAll(dto.locale);
        const customerRecipesRatings = !dto.customerId ? [] : await this.recipeRatingRepository.findAllByCustomer(new CustomerId(dto.customerId), dto.locale);

        const ratingPromises = recipes.map((recipe) =>
            this.recipeRatingRepository.findAverageRatingByRecipe(recipe.id)
                .then((rating) => ({ id: recipe.id.toString(), rating }))
        );

        const ratings = await Promise.all(ratingPromises);
        const averageRecipeRatingsMap = new Map<string, number>(ratings.map(({ id, rating }) => [id, rating]));


        return { plans, recipes, week, averageRecipeRatingsMap, userRatings: customerRecipesRatings };
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

    /**
     * Getter recipeRatingRepository
     * @return {IRateRepository}
     * */
    public get recipeRatingRepository(): IRateRepository {
        return this._recipeRatingRepository;
    }

}
