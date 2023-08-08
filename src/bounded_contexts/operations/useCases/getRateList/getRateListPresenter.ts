import { v3S3Service } from "../../application/storageService";
import { IStorageService } from "../../application/storageService/IStorageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";

export type HttpGetRateListResponse = {
    id: string;
    customer: string;
    recipeId: string;
    recipeName: string;
    recipeImageUrl: string;
    rating: number | undefined;
    comment: string | undefined;
    lastShippingDate: string;
    qtyDelivered: number;
    isRated: boolean;
    isRateable: boolean;
}[];
export class GetRateListPresenter {

    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public static async present(rates: RecipeRating[], queryDate: Date): Promise<HttpGetRateListResponse> {
        const presentedRates = [];

        for (let rate of rates) {
            const recipeImageUrl = await v3S3Service.getPresignedUrlForFile(rate.recipe.getMainImageUrl());
            presentedRates.push({
                id: rate.id.toString(),
                customer: rate.customerId.toString(),
                recipeId: rate.recipe.id.toString(),
                recipeName: rate.recipe.getName(),
                recipeImageUrl,
                rating: rate.rating,
                comment: rate.comment,
                lastShippingDate: !!rate.getLastShippingDate() ? MomentTimeService.getDdMmYyyy(rate.getLastShippingDate()!) : "",
                qtyDelivered: rate.getQtyDelivered(),
                isRated: rate.isRated(),
                isRateable: rate.isRateable(queryDate),
            });
        }
        return presentedRates;
    }


    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

}
