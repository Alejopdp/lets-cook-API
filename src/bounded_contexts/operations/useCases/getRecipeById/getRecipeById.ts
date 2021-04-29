import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { GetRecipeByIdDto } from "./getRecipeByIdDto";
import { GetRecipeByIdPresenter } from "./getRecipeByIdPresenter";

export class GetRecipeById {
    private _recipeRepository: IRecipeRepository;

    constructor(recipeRepository: IRecipeRepository) {
        this._recipeRepository = recipeRepository;
    }

    public async execute(dto: GetRecipeByIdDto): Promise<any> {
        const recipeId: RecipeId = new RecipeId(dto.recipeId);
        const recipe: Recipe | undefined = await this.recipeRepository.findById(recipeId);

        if (!recipe) throw new Error("Error al buscar la receta");

        return GetRecipeByIdPresenter.present(recipe);
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }

    /**
     * Setter recipeRepository
     * @param {IRecipeRepository} value
     */
    public set recipeRepository(value: IRecipeRepository) {
        this._recipeRepository = value;
    }
}
