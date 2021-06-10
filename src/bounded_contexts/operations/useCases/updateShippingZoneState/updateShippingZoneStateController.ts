import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { UpdateShippingZone } from "./updateShippingZoneState";
import { UpdateShippingZoneStateDto } from "./updateCouponStateDto";
import fs from "fs";
import { Locale } from "../../domain/locale/Locale";

export class UpdateShippingZoneStateController extends BaseController {
    private _updateShippingZoneState: UpdateShippingZone;

    constructor(updateShippingZoneState: UpdateShippingZone) {
        super();
        this._updateShippingZoneState = updateShippingZoneState;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateShippingZoneStateDto = {
                id: this.req.params.id,
                state: this.req.body.state
            };

            await this.updateShippingZoneState.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter updatePlan
     * @return {UpdatePlan}
     */
    public get updateShippingZoneState(): UpdateShippingZone {
        return this._updateShippingZoneState;
    }
}
