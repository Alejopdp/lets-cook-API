import { CustomerId } from "../../domain/customer/CustomerId";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { GetRateListDto } from "./getRateListDto";
import { GetRateListPresenter, HttpGetRateListResponse } from "./getRateListPresenter";

export class GetRateList {
    private _recipeRatingRepository: IRateRepository;
    private _getRateListPresenter: GetRateListPresenter;

    constructor(recipeRatingRepository: IRateRepository, storageService: GetRateListPresenter) {
        this._recipeRatingRepository = recipeRatingRepository;
        this._getRateListPresenter = storageService;
    }

    public async execute(dto: GetRateListDto): Promise<HttpGetRateListResponse> {
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
     * Getter getRateListPresenter
     * @return {GetRateListPresenter}
     */
    public get getRateListPresenter(): GetRateListPresenter {
        return this._getRateListPresenter;
    }
}
