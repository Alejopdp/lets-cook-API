import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteRate } from "./deleteRate";
import { DeleteRateDto } from "./deleteRateDto";

export class DeleteRateController extends BaseController {
    private _deleteRate: DeleteRate;

    constructor(deleteRate: DeleteRate) {
        super();
        this._deleteRate = deleteRate;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteRateDto = {
                rateId: this.req.params.id,
            };

            await this.deleteRate.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteRate
     * @return {DeleteRate}
     */
    public get deleteRate(): DeleteRate {
        return this._deleteRate;
    }
}
