import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateCoupon } from "./updateCouponState";
import { UpdateCuponStateDto } from "./updateCouponStateDto";
import fs from "fs";
import { Locale } from "../../domain/locale/Locale";

export class UpdateCouponStateController extends BaseController {
    private _updateCouponState: UpdateCoupon;

    constructor(updateCouponState: UpdateCoupon) {
        super();
        this._updateCouponState = updateCouponState;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateCuponStateDto = {
                id: this.req.params.id,
                state: this.req.body.state,
            };

            await this.updateCouponState.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updatePlan
     * @return {UpdatePlan}
     */
    public get updateCouponState(): UpdateCoupon {
        return this._updateCouponState;
    }
}
