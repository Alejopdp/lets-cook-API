import { BaseController } from "../../../../core/infra/BaseController";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { RefundPaymentOrder } from "./refundPaymentOrder";
import { RefundPaymentOrderDto } from "./refundPaymentOrderDto";
import { RefundPaymentOrderPresenter } from "./refundPaymentOrderPresenter";

export class RefundPaymentOrderController extends BaseController {
    private _refundPaymentOrder: RefundPaymentOrder;
    private _refundPaymentOrderPresenter: RefundPaymentOrderPresenter;

    constructor(refundPaymentOrder: RefundPaymentOrder, refundPaymentOrderPresenter: RefundPaymentOrderPresenter) {
        super();
        this._refundPaymentOrder = refundPaymentOrder;
        this._refundPaymentOrderPresenter = refundPaymentOrderPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: RefundPaymentOrderDto = {
                paymentOrderId: this.req.params.id,
                amount: this.req.body.amount,
            };

            const paymentOrder: PaymentOrder = await this.refundPaymentOrder.execute(dto);
            const presented = this.refundPaymentOrderPresenter.present(paymentOrder);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error as Error);
        }
    }

    /**
     * Getter refundPaymentOrder
     * @return {RefundPaymentOrder}
     */
    public get refundPaymentOrder(): RefundPaymentOrder {
        return this._refundPaymentOrder;
    }

    /**
     * Getter refundPaymentOrderPresenter
     * @return {RefundPaymentOrderPresenter}
     */
    public get refundPaymentOrderPresenter(): RefundPaymentOrderPresenter {
        return this._refundPaymentOrderPresenter;
    }
}
