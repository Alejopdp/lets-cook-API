import { BaseController } from "../../../../core/infra/BaseController";
import { RefundPaymentOrder } from "./refundPaymentOrder";
import { RefundPaymentOrderDto } from "./refundPaymentOrderDto";

export class RefundPaymentOrderController extends BaseController {
    private _refundPaymentOrder: RefundPaymentOrder;

    constructor(refundPaymentOrder: RefundPaymentOrder) {
        super();
        this._refundPaymentOrder = refundPaymentOrder;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: RefundPaymentOrderDto = {
                paymentOrderId: this.req.params.id,
                amount: this.req.body.amount,
            };

            await this.refundPaymentOrder.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter refundPaymentOrder
     * @return {RefundPaymentOrder}
     */
    public get refundPaymentOrder(): RefundPaymentOrder {
        return this._refundPaymentOrder;
    }
}
