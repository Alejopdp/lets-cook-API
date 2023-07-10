import { BaseController } from "../../../../core/infra/BaseController";
import { ChargeOnePaymentOrder } from "./chargeOnePaymentOrder";
import { ChargeOnePaymentOrderDto } from "./chargeOnePaymentOrderDto";
import { ChargeOnePaymentOrderPresenter } from "./chargeOnePaymentOrderPresenter";

export class ChargeOnePaymentOrderController extends BaseController {
    private _chargeOnePaymentOrder: ChargeOnePaymentOrder;
    private _chargeOnePaymentOrderPresenter: ChargeOnePaymentOrderPresenter;

    constructor(chargeOnePaymentOrder: ChargeOnePaymentOrder, chargeOnePaymentOrderPresenter: ChargeOnePaymentOrderPresenter) {
        super();
        this._chargeOnePaymentOrder = chargeOnePaymentOrder;
        this._chargeOnePaymentOrderPresenter = chargeOnePaymentOrderPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ChargeOnePaymentOrderDto = {
                paymentOrderId: this.req.params.id,
            };

            const result = await this.chargeOnePaymentOrder.execute(dto);
            const presented = this.chargeOnePaymentOrderPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error: any) {
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

    /**
     * Getter chargeOnePaymentOrderPresenter
     * @return {ChargeOnePaymentOrderPresenter}
     */
    public get chargeOnePaymentOrderPresenter(): ChargeOnePaymentOrderPresenter {
        return this._chargeOnePaymentOrderPresenter;
    }
}
