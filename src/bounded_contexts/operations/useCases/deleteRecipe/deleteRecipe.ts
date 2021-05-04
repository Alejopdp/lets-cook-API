import { RecipeId } from "../../domain/recipe/RecipeId";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { DeleteRecipeDto } from "./deleteRecipeDto";

export class DeleteRecipe {
    private _recipeRepository: IRecipeRepository;

    constructor(recipeRepository: IRecipeRepository) {
        this._recipeRepository = recipeRepository;
    }

    public async execute(dto: DeleteRecipeDto): Promise<void> {
        // TO DO: Validations
        await this.recipeRepository.delete(new RecipeId(dto.recipeId));
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }
}
