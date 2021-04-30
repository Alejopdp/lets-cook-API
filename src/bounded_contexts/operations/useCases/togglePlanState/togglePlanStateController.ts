import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { TogglePlanState } from "./togglePlanState";
import { TogglePlanStateDto } from "./togglePlanStateDto";

export class TogglePlanStateController extends BaseController {
    private _togglePlanState: TogglePlanState;

    constructor(togglePlanState: TogglePlanState) {
        super();
        this._togglePlanState = togglePlanState;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: TogglePlanStateDto = {
                planId: parseInt(this.req.params.id),
            };

            await this.togglePlanState.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter togglePlanState
     * @return {TogglePlanState}
     */
    public get togglePlanState(): TogglePlanState {
        return this._togglePlanState;
    }
}
