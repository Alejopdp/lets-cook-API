import { IStorageService } from "../../application/storageService/IStorageService";
import { Recipe } from "../../domain/recipe/Recipe";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { GetRecipeListDto } from "./getRecipeListDto";
import { GetRecipeListPresenter } from "./getRecipeListPresenter";

export class GetRecipeList {
    private _recipeRepository: IRecipeRepository;
    private _storageService: IStorageService;
    private _weeksRepository: IWeekRepository;

    constructor(recipeRepository: IRecipeRepository, storageService: IStorageService, weeksRepository: IWeekRepository) {
        this._recipeRepository = recipeRepository;
        this._storageService = storageService;
        this._weeksRepository = weeksRepository;
    }

    public async execute(dto: GetRecipeListDto): Promise<void> {
        const dates = typeof dto.dates === "string" ? [dto.dates] : dto.dates;
        let recipeList: Recipe[] = []

        if (Array.isArray(dates)) {
            const weeks = await this.weeksRepository.findContaing(dates.map((date) => new Date(date)));
            const weekIds = weeks.map((week) => week.id);
            recipeList = await this.recipeRepository.findAllAvailableOnWeeks(weekIds, dto.locale);
        } else {
            recipeList = await this.recipeRepository.findAll(dto.locale);
        }

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


    /**
     * Getter weeksRepository
     * @return {IWeekRepository}
     */
    public get weeksRepository(): IWeekRepository {
        return this._weeksRepository;
    }

}
