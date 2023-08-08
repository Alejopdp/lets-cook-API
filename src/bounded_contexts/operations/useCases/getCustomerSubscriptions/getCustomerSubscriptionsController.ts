import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCustomerSubscriptions } from "./getCustomerSubscriptions";
import { GetCustomerSubscriptionsDto } from "./getCustomerSubscriptionsDto";
import { GetCustomerSubscriptionsPresenter } from "./getCustomerSubscriptionsPresenter";

export class GetCustomersubscriptionsController extends BaseController {
    private _getCustomersubscriptions: GetCustomerSubscriptions;
    private _getCustomerSubscriptionsPresenter: GetCustomerSubscriptionsPresenter;

    constructor(getCustomersubscriptions: GetCustomerSubscriptions, getCustomerSubscriptionsPresenter: GetCustomerSubscriptionsPresenter) {
        super();
        this._getCustomersubscriptions = getCustomersubscriptions;
        this._getCustomerSubscriptionsPresenter = getCustomerSubscriptionsPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCustomerSubscriptionsDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                customerId: this.req.params.customerId,
                queryDate: new Date(),
            };
            const result = await this.getCustomersubscriptions.execute(dto);
            const presentedResult = await this.getCustomerSubscriptionsPresenter.present(
                result.subscriptions,
                result.nextOrders,
                dto.locale,
                result.ratings,
                result.customer,
                new Date()
            );

            return this.ok(this.res, presentedResult);
        } catch (error: any) {
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

    /**
     * Getter getCustomerSubscriptionsPresenter
     * @return {GetCustomerSubscriptionsPresenter}
     */
    public get getCustomerSubscriptionsPresenter(): GetCustomerSubscriptionsPresenter {
        return this._getCustomerSubscriptionsPresenter;
    }
}
