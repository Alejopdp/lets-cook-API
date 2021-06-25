import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCustomerSubscriptions } from "./getCustomerSubscriptions";
import { GetCustomerSubscriptionsDto } from "./getCustomerSubscriptionsDto";

export class GetCustomersubscriptionsController extends BaseController {
    private _getCustomersubscriptions: GetCustomerSubscriptions;

    constructor(getCustomersubscriptions: GetCustomerSubscriptions) {
        super();
        this._getCustomersubscriptions = getCustomersubscriptions;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCustomerSubscriptionsDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                customerId: this.req.params.customerId,
            };
            const result = await this.getCustomersubscriptions.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetCustomersubscriptions}
     */
    public get getCustomersubscriptions(): GetCustomerSubscriptions {
        return this._getCustomersubscriptions;
    }
}
