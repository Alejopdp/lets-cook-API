import { s3Service } from "../../application/storageService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { PlanId } from "../../domain/plan/PlanId";
import { Rate } from "../../domain/rate/Rate";
import { Week } from "../../domain/week/Week";

export class GetRateListPresenter {
    public static async present(rates: Rate[]): Promise<any> {
        const presentedRates = [];

        for (let rate of rates) {
            presentedRates.push({
                id: rate.id.value,
                customer: rate.customerId.value,
                recipe: rate.recipeId.value,
                rate_value: rate.rateValue,
                comment_rate: rate.comment
            });
        }
        return presentedRates;
    }
}
