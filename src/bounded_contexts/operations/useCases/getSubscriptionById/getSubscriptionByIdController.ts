import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetSubscriptionById } from "./getSubscriptionById";
import { GetSubscriptionByIdDto } from "./getSubscriptionByIdDto";
import { GetSubscriptionByIdPresenter } from "./getSubscriptionByIdPresenter";

export class GetSubscriptionByIdController extends BaseController {
    private _getSubscriptionById: GetSubscriptionById;
    private _getSubscriptionByIdPresenter: GetSubscriptionByIdPresenter;

    constructor(getSubscriptionById: GetSubscriptionById, getSubscriptionByIdPresenter: GetSubscriptionByIdPresenter) {
        super();
        this._getSubscriptionById = getSubscriptionById;
        this._getSubscriptionByIdPresenter = getSubscriptionByIdPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetSubscriptionByIdDto = {
                subscriptionId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getSubscriptionById.execute(dto);
            const presented = await this.getSubscriptionByIdPresenter.present(
                result.subscription,
                result.orders,
                result.customer,
                result.paymentOrders
            );

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetSubscriptionById}
     */
    public get getSubscriptionById(): GetSubscriptionById {
        return this._getSubscriptionById;
    }

    /**
     * Getter getSubscriptionByIdPresenter
     * @return {GetSubscriptionByIdPresenter}
     */
    public get getSubscriptionByIdPresenter(): GetSubscriptionByIdPresenter {
        return this._getSubscriptionByIdPresenter;
    }
}
