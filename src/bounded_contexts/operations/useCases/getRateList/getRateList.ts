import { IStorageService } from "../../application/storageService/IStorageService";
import { Rate } from "../../domain/rate/Rate";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { GetRateListPresenter } from "./getRateListPresenter";

export class GetRateList {
    private _recipeRepository: IRateRepository;
    private _storageService: IStorageService;

    constructor(recipeRepository: IRateRepository, storageService: IStorageService) {
        this._recipeRepository = recipeRepository;
        this._storageService = storageService;
    }

    public async execute(): Promise<void> {
        const recipeList: Rate[] = await this.recipeRepository.findAll();

        return await GetRateListPresenter.present(recipeList);

    }

    /**
     * Getter recipeRepository
     * @return {IRateRepository}
     */
    public get recipeRepository(): IRateRepository {
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
