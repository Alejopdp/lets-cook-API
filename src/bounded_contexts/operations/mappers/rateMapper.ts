import { Mapper } from "../../../core/infra/Mapper";
import { Rate } from "../domain/rate/Rate";
import { RateId } from "../domain/rate/RateId";
import { CustomerId } from "../domain/customer/CustomerId";
import { RecipeId } from "../domain/recipe/RecipeId";

export class RateMapper implements Mapper<Rate> {
    public toDomain(raw: any): Rate {
        const customerId = new CustomerId(raw.customerId);
        const recipeId = new RecipeId(raw.recipeId);
        return Rate.create(customerId, recipeId, raw.rateValue, raw.comment, new RateId(raw._id));
    }
    public toPersistence(t: Rate): any {
        return {
            customerId: t.customerId,
            recipeId: t.recipeId,
            rateValue: t.rateValue,
            comment: t.comment,
            _id: t.id.value,
        };
    }
}
