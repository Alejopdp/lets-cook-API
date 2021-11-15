import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPaymentOrderById } from "./getPaymentOrderById";
import { GetPaymentOrderByIdDto } from "./getPaymentOrderByIdDto";
import { GetPaymentOrderByIdPresenter } from "./getPaymentOrderByIdPresenter";

export class GetPaymentOrderByIdController extends BaseController {
    private _getPaymentOrderById: GetPaymentOrderById;
    private _getPaymentOrderByIdPresenter: GetPaymentOrderByIdPresenter;

    constructor(getPaymentOrderById: GetPaymentOrderById, getPaymentOrderByIdPresenter: GetPaymentOrderByIdPresenter) {
        super();
        this._getPaymentOrderById = getPaymentOrderById;
        this._getPaymentOrderByIdPresenter = getPaymentOrderByIdPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPaymentOrderByIdDto = {
                paymentOrderId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getPaymentOrderById.execute(dto);
            const presented = await this.getPaymentOrderByIdPresenter.present(
                result.paymentOrder,
                result.orders,
                result.customer,
                result.subscriptions
            );

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter GetPaymentOrderById
     * @return {GetPaymentOrderById}
     */
    public get getPaymentOrderById(): GetPaymentOrderById {
        return this._getPaymentOrderById;
    }

    /**
     * Getter getPaymentOrderByIdPresenter
     * @return {GetPaymentOrderByIdPresenter}
     */
    public get getPaymentOrderByIdPresenter(): GetPaymentOrderByIdPresenter {
        return this._getPaymentOrderByIdPresenter;
    }
}
