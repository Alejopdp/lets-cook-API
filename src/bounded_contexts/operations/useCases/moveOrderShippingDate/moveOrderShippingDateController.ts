import { BaseController } from "../../../../core/infra/BaseController";
import { MoveOrderShippingDate } from "./moveOrderShippingDate";
import { MoveOrderShippingDateDto } from "./moveOrderShippingDateDto";
import { MoveOrderShippingDatePresenter } from "./moveOrderShippingDatePresenter";

export class MoveOrderShippingDateController extends BaseController {
    private _moveOrderShippingDate: MoveOrderShippingDate;
    private _moveOrderShippingDatePresenter: MoveOrderShippingDatePresenter;

    constructor(moveOrderShippingDate: MoveOrderShippingDate, moveOrderShippingDatePresenter: MoveOrderShippingDatePresenter) {
        super();
        this._moveOrderShippingDate = moveOrderShippingDate;
        this._moveOrderShippingDatePresenter = moveOrderShippingDatePresenter
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: MoveOrderShippingDateDto = {
                orderId: this.req.params.orderId,
            };

            const result = await this.moveOrderShippingDate.execute(dto);
            const presented = this.moveOrderShippingDatePresenter.present(result)

            return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter moveOrderShippingDateBilling
     * @return {MoveOrderShippingDate}
     */
    public get moveOrderShippingDate(): MoveOrderShippingDate {
        return this._moveOrderShippingDate;
    }


    /**
     * Getter moveOrderShippingDatePresenter
     * @return {MoveOrderShippingDatePresenter}
     */
    public get moveOrderShippingDatePresenter(): MoveOrderShippingDatePresenter {
        return this._moveOrderShippingDatePresenter;
    }

}
