import { BaseController } from "../../../../core/infra/BaseController";
import { GetNextOrdersBySubscription } from "./getNextOrdersBySubscription";
import { GetNextOrdersBySubscriptionDto } from "./getNextOrdersBySubscriptionDto";

export class GetNextOrdersBySubscriptionController extends BaseController {
    private _getNextOrdersBySubscription: GetNextOrdersBySubscription;

    constructor(getNextOrdersBySubscription: GetNextOrdersBySubscription) {
        super();
        this._getNextOrdersBySubscription = getNextOrdersBySubscription;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetNextOrdersBySubscriptionDto = {
                subscriptionId: this.req.params.subscriptionId,
            };

            const result = await this.GetNextOrdersBySubscription.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetNextOrdersBySubscription}
     */
    public get GetNextOrdersBySubscription(): GetNextOrdersBySubscription {
        return this._getNextOrdersBySubscription;
    }
}
