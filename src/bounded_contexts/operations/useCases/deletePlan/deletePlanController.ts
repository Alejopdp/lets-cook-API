import { BaseController } from "../../../../core/infra/BaseController";
import { DeletePlan } from "./deletePlan";
import { DeletePlanDto } from "./deletePlanDto";

export class DeletePlanController extends BaseController {
    private _deletePlan: DeletePlan;

    constructor(deletePlan: DeletePlan) {
        super();
        this._deletePlan = deletePlan;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeletePlanDto = {
                planId: this.req.params.id,
            };

            await this.deletePlan.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter deletePlan
     * @return {DeletePlan}
     */
    public get deletePlan(): DeletePlan {
        return this._deletePlan;
    }
}
