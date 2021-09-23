import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetRecipesByRestrictionsDto } from "./getRecipesByRestrictionsDto";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { Week } from "../../domain/week/Week";
import { Recipe } from "../../domain/recipe/Recipe";
import { Locale } from "../../domain/locale/Locale";
import { RecipeRestrictionId } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";

export class GetRecipesByRestrictions {
    private _recipeRepository: IRecipeRepository;

    constructor(recipeRepository: IRecipeRepository) {
        this._recipeRepository = recipeRepository;
    }

    public async execute(dto: GetRecipesByRestrictionsDto): Promise<any> {
        const recipes: Recipe[] = await this.recipeRepository.findBy({ relatedPlans: dto.planId });

        let filterRecipesByrestriction = recipes.filter((recipe: Recipe) => {
            recipe.recipeVariants.filter((variant) => variant.restriction.id.equals(new RecipeRestrictionId(dto.restrictionId)));
        });

        return filterRecipesByrestriction;
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }
}
