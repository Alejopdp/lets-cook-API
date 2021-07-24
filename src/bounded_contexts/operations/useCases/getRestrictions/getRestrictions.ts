import { IRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction/IRecipeRestrictionRepository";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export class GetRestrictions {
    private _restrictionsRepository: IRecipeRestrictionRepository;

    constructor(restrictionsRepository: IRecipeRestrictionRepository) {
        this._restrictionsRepository = restrictionsRepository;
    }

    public async execute(): Promise<RecipeVariantRestriction[]> {
        const restrictions: RecipeVariantRestriction[] = await this.restrictionsRepository.findAll();

        return restrictions;
    }

    /**
     * Getter restrictionsRepository
     * @return {IRecipeRestrictionRepository}
     */
    public get restrictionsRepository(): IRecipeRestrictionRepository {
        return this._restrictionsRepository;
    }
}
