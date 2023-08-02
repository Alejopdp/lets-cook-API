import { v3S3Service } from "../../application/storageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";

export class GetRateListPresenter {
    public static async present(rates: RecipeRating[]): Promise<any> {
        const presentedRates = [];

        for (let rate of rates) {
            const recipeImageUrl = await v3S3Service.getPresignedUrlForFile(rate.recipe.getMainImageUrl());
            presentedRates.push({
                id: rate.id.value,
                customer: rate.customerId.toString(),
                recipeId: rate.recipe.id.toString(),
                recipeName: rate.recipe.getName(),
                recipeImageUrl,
                rating: rate.rating,
                comment: rate.comment,
                lastShippingDate: !!rate.getLastShippingDate() ? MomentTimeService.getDdMmYyyy(rate.getLastShippingDate()!) : "",
                qtyDelivered: rate.getQtyDelivered(),
                isRated: !!rate.rating && rate.rating > 0,
                isRateable: rate.isRateable(),
            });
        }
        return presentedRates;
    }
}
