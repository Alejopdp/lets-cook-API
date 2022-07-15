import { Mapper } from "../../../core/infra/Mapper";
import { CustomerId } from "../domain/customer/CustomerId";
import { RecipeRating } from "../domain/recipeRating/RecipeRating";
import { RecipeRatingId } from "../domain/recipeRating/RecipeRatingId";
import { recipeMapper } from "./recipeMapper";
import { Locale } from "../domain/locale/Locale";

export class RateMapper implements Mapper<RecipeRating, any> {
    public toDomain(raw: any, locale: Locale): RecipeRating {
        const customerId = new CustomerId(raw.customer);
        const recipe = recipeMapper.toDomain(raw.recipe, locale);

        return new RecipeRating(
            recipe,
            customerId,
            raw.qtyDelivered,
            raw.lastShippingDate,
            raw.beforeLastShippingDate,
            raw.shippingDates,
            raw.rating,
            raw.comment,
            new RecipeRatingId(raw._id)
        );
    }
    public toPersistence(t: RecipeRating): any {
        return {
            customer: t.customerId.toString(),
            recipe: t.recipe.id.toString(),
            qtyDelivered: t.qtyDelivered,
            lastShippingDate: t.lastShippingDate,
            beforeLastShippingDate: t.beforeLastShippingDate,
            shippingDates: t.shippingDates,
            rating: t.rating,
            comment: t.comment,
            _id: t.id.value,
        };
    }
}
