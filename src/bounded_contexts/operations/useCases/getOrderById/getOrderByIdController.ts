import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetOrderById } from "./getOrderById";
import { GetOrderByIdDto } from "./getOrderByIdDto";
import { GetOrderByIdPresenter } from "./getOrderByIdPresenter";

export class GetOrderByIdController extends BaseController {
    private _getOrderById: GetOrderById;
    private _getOrderByIdPresenter: GetOrderByIdPresenter;

    constructor(getOrderById: GetOrderById, getOrderByIdPresenter: GetOrderByIdPresenter) {
        super();
        this._getOrderById = getOrderById;
        this._getOrderByIdPresenter = getOrderByIdPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetOrderByIdDto = {
                orderId: this.req.params.id,
            };

            const result = await this.getOrderById.execute(dto);
            const presented = await this.getOrderByIdPresenter.present(
                result.paymentOrder,
                result.order,
                result.customer,
                result.subscription
            );

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter GetOrderById
     * @return {GetOrderById}
     */
    public get getOrderById(): GetOrderById {
        return this._getOrderById;
    }

    /**
     * Getter getOrderByIdPresenter
     * @return {GetOrderByIdPresenter}
     */
    public get getOrderByIdPresenter(): GetOrderByIdPresenter {
        return this._getOrderByIdPresenter;
    }
}
