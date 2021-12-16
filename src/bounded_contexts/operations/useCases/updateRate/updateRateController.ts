import { updateRate } from "./index";
import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateRateDto } from "./updateRateDto";
import { UpdateRate } from "./updateRate";

export class UpdateRateController extends BaseController {
    private _updateRate: UpdateRate;

    constructor(updateRate: UpdateRate) {
        super();
        this._updateRate = updateRate;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateRateDto = {
                rateId: this.req.params.id,
                rateValue: this.req.body.rating,
                commentRate: this.req.body.comment,
            };

            console.log("Rate value: ", this.req.body.rating);
            console.log("Comment value: ", this.req.body.comment);
            await this.updateRate.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateRate
     * @return {UpdateRate}
     */
    public get updateRate(): UpdateRate {
        return this._updateRate;
    }
}
