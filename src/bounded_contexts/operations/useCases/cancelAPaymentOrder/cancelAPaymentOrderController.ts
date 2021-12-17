import { BaseController } from "../../../../core/infra/BaseController";
import { CancelAPaymentOrder } from "./cancelAPaymentOrder";
import { CancelAPaymentOrderDto } from "./cancelAPaymentOrderDto";

export class CancelAPaymentOrderController extends BaseController {
    private _cancelASubscription: CancelAPaymentOrder;

    constructor(cancelAPaymentOrder: CancelAPaymentOrder) {
        super();
        this._cancelASubscription = cancelAPaymentOrder;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CancelAPaymentOrderDto = {
                paymentOrderId: this.req.params.id,
            };
            await this.cancelAPaymentOrder.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter cancelAPaymentOrder
     * @return {CancelAPaymentOrder}
     */
    public get cancelAPaymentOrder(): CancelAPaymentOrder {
        return this._cancelASubscription;
    }
}
