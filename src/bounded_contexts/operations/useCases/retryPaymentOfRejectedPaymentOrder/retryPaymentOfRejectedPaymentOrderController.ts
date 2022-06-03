import { BaseController } from "../../../../core/infra/BaseController";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { RetryPaymentOfRejectedPaymentOrder } from "./retryPaymentOfRejectedPaymentOrder";
import { RetryPaymentOfRejectedPaymentOrderDto } from "./retryPaymentOfRejectedPaymentOrderDto";
import { RetryPaymentOfRejectedPaymentOrderPresenter } from "./retryPaymentOfRejectedPaymentOrderPresenter";

export class RetryPaymentOfRejectedPaymentOrderController extends BaseController {
    private _retryPaymentOfRejectedPaymentOrder: RetryPaymentOfRejectedPaymentOrder;
    private _retryPaymentOfRejectedPaymentOrderPresenter: RetryPaymentOfRejectedPaymentOrderPresenter;

    constructor(
        retryPaymentOfRejectedPaymentOrder: RetryPaymentOfRejectedPaymentOrder,
        retryPaymentOfRejectedPaymentOrderPresenter: RetryPaymentOfRejectedPaymentOrderPresenter
    ) {
        super();
        this._retryPaymentOfRejectedPaymentOrder = retryPaymentOfRejectedPaymentOrder;
        this._retryPaymentOfRejectedPaymentOrderPresenter = retryPaymentOfRejectedPaymentOrderPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: RetryPaymentOfRejectedPaymentOrderDto = {
                paymentOrderId: this.req.params.id,
            };

            const paymentOrder = await this.retryPaymentOfRejectedPaymentOrder.execute(dto);
            const presented = this.retryPaymentOfRejectedPaymentOrderPresenter.present(paymentOrder);

            return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error as Error);
        }
    }

    /**
     * Getter retryPaymentOfRejectedPaymentOrder
     * @return {RetryPaymentOfRejectedPaymentOrder}
     */
    public get retryPaymentOfRejectedPaymentOrder(): RetryPaymentOfRejectedPaymentOrder {
        return this._retryPaymentOfRejectedPaymentOrder;
    }

    /**
     * Getter retryPaymentOfRejectedPaymentOrderPresenter
     * @return {RetryPaymentOfRejectedPaymentOrderPresenter}
     */
    public get retryPaymentOfRejectedPaymentOrderPresenter(): RetryPaymentOfRejectedPaymentOrderPresenter {
        return this._retryPaymentOfRejectedPaymentOrderPresenter;
    }
}
