import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCustomerPaymentOrders } from "./getCustomerPaymentOrders";
import { GetCustomerPaymentOrdersDto } from "./getCustomerPaymentOrdersDto";
import { GetCustomerPaymentOrdersPresenter } from "./getCustomerPaymentOrdersPresenter";

export class GetCustomerPaymentOrdersController extends BaseController {
    private _getCustomerPaymentOrders: GetCustomerPaymentOrders;
    private _getCustomerPaymentOrdersPresenter: GetCustomerPaymentOrdersPresenter;

    constructor(getCustomerPaymentOrders: GetCustomerPaymentOrders, getCustomerPaymentOrdersPresenter: GetCustomerPaymentOrdersPresenter) {
        super();
        this._getCustomerPaymentOrders = getCustomerPaymentOrders;
        this._getCustomerPaymentOrdersPresenter = getCustomerPaymentOrdersPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCustomerPaymentOrdersDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                customerId: this.req.params.customerId,
            };
            const result = await this.getCustomerPaymentOrders.execute(dto);
            const presentedResult = this.getCustomerPaymentOrdersPresenter.present(result.paymentOrders, result.ordersCountMap);

            return this.ok(this.res, presentedResult);
        } catch (error) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getCustomerPaymentOrders
     * @return {GetCustomerPaymentOrders}
     */
    public get getCustomerPaymentOrders(): GetCustomerPaymentOrders {
        return this._getCustomerPaymentOrders;
    }

    /**
     * Getter getCustomerPaymentOrdersPresenter
     * @return {GetCustomerPaymentOrdersPresenter}
     */
    public get getCustomerPaymentOrdersPresenter(): GetCustomerPaymentOrdersPresenter {
        return this._getCustomerPaymentOrdersPresenter;
    }
}
