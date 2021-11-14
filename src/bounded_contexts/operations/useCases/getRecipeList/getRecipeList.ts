import { IStorageService } from "../../application/storageService/IStorageService";
import { Recipe } from "../../domain/recipe/Recipe";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { GetRecipeListDto } from "./getRecipeListDto";
import { GetRecipeListPresenter } from "./getRecipeListPresenter";

export class GetRecipeList {
    private _recipeRepository: IRecipeRepository;
    private _storageService: IStorageService;

    constructor(recipeRepository: IRecipeRepository, storageService: IStorageService) {
        this._recipeRepository = recipeRepository;
        this._storageService = storageService;
    }

    public async execute(dto: GetRecipeListDto): Promise<void> {
        const recipeList: Recipe[] = await this.recipeRepository.findAll(dto.locale);

        return await GetRecipeListPresenter.present(recipeList);
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
