import { BaseController } from "../../../../core/infra/BaseController";
import { ChargeOnePaymentOrder } from "./chargeOnePaymentOrder";
import { ChargeOnePaymentOrderDto } from "./chargeOnePaymentOrderDto";

export class ChargeOnePaymentOrderController extends BaseController {
    private _chargeOnePaymentOrder: ChargeOnePaymentOrder;

    constructor(chargeOnePaymentOrder: ChargeOnePaymentOrder) {
        super();
        this._chargeOnePaymentOrder = chargeOnePaymentOrder;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ChargeOnePaymentOrderDto = {
                paymentOrderId: this.req.params.id,
            };

            await this.chargeOnePaymentOrder.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter chargeOnePaymentOrder
     * @return {ChargeOnePaymentOrder}
     */
    public get chargeOnePaymentOrder(): ChargeOnePaymentOrder {
        return this._chargeOnePaymentOrder;
    }
}
