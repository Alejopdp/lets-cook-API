import { Recipe } from "../../domain/recipe/Recipe";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { GetRecipeListPresenter } from "./getRecipeListPresenter";

export class GetRecipeList {
    private _recipeRepository: IRecipeRepository;

    constructor(recipeRepository: IRecipeRepository) {
        this._recipeRepository = recipeRepository;
    }

    public async execute(): Promise<void> {
        const recipeList: Recipe[] = await this.recipeRepository.findAll();

        return GetRecipeListPresenter.present(recipeList);
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
