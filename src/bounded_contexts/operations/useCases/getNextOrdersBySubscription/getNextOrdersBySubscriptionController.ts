import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
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
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.GetNextOrdersBySubscription.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
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
