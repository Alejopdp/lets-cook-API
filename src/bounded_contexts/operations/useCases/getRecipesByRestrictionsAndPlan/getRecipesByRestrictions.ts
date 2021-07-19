import { Plan } from "../../domain/plan/Plan";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { GetRecipesByRestrictionsDto } from "./getRecipesByRestrictionsDto";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { Week } from "../../domain/week/Week";
import { Recipe } from "../../domain/recipe/Recipe";
import { Locale } from "../../domain/locale/Locale";

export class GetRecipesByRestrictions {
    private _recipeRepository: IRecipeRepository;

    constructor(recipeRepository: IRecipeRepository) {
        this._recipeRepository = recipeRepository;
    }

    public async execute(dto: GetRecipesByRestrictionsDto): Promise<any> {

        const recipes: Recipe[] = await this.recipeRepository.findBy({ relatedPlans: dto.planId });

        console.log("Recipes: ", recipes);

        let filterRecipesByrestriction = recipes.filter((val: Recipe) => {
            for(let i = 0; i < val.recipeVariants.length; i++) {
                console.log("Filtering: ", val.recipeVariants[i].recipeVariantRestrictions)
                return  val.recipeVariants[i].recipeVariantRestrictions[0]
                    && val.recipeVariants[i].recipeVariantRestrictions[0].id 
                    && val.recipeVariants[i].recipeVariantRestrictions[0].id.value
                    && val.recipeVariants[i].recipeVariantRestrictions[0].id.value === dto.restrictionId
            } 
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
