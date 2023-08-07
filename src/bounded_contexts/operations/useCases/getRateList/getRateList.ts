import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { GetRateListDto } from "./getRateListDto";
import { GetRateListPresenter } from "./getRateListPresenter";

export class GetRateList {
    private _recipeRatingRepository: IRateRepository;
    private _storageService: IStorageService;

    constructor(recipeRatingRepository: IRateRepository, storageService: IStorageService) {
        this._recipeRatingRepository = recipeRatingRepository;
        this._storageService = storageService;
    }

    public async execute(dto: GetRateListDto): Promise<void> {
        var ratings: RecipeRating[] = [];

        if (!!dto.customerId) ratings = await this.recipeRatingRepository.findAllByCustomer(new CustomerId(dto.customerId), dto.locale);
        else ratings = await this.recipeRatingRepository.findAll(dto.locale);

        return await GetRateListPresenter.present(ratings, dto.queryDate);
    }

    /**
     * Getter recipeRatingRepository
     * @return {IRateRepository}
     */
    public get recipeRatingRepository(): IRateRepository {
        return this._recipeRatingRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
