import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
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
                planId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            await this.togglePlanState.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
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
