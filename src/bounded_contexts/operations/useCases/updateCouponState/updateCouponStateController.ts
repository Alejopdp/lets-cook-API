import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
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
                state: this.req.body.state
            };

            await this.updateCouponState.execute(dto);

            return this.ok(this.res);
        } catch (error) {
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
