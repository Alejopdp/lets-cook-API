import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { ReorderPlan } from "./reorderPlan";
import { ReorderPlanDto } from "./reorderPlanDto";
import { ReorderPlanPresenter } from "./reorderPlanPresenter";

export class ReorderPlanController extends BaseController {
    private _reorderPlan: ReorderPlan;
    private _reorderPlanPresenter: ReorderPlanPresenter;

    constructor(reorderPlan: ReorderPlan, reorderPlanPresenter: ReorderPlanPresenter) {
        super();
        this._reorderPlan = reorderPlan;
        this._reorderPlanPresenter = reorderPlanPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ReorderPlanDto = {
                subscriptionId: this.req.params.subscriptionId,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.reorderPlan.execute(dto);
            const presented = this.reorderPlanPresenter.present(result.subscription, result.paymentIntent, result.firstOrder);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter ReorderPlan
     * @return {ReorderPlan}
     */
    public get reorderPlan(): ReorderPlan {
        return this._reorderPlan;
    }

    /**
     * Getter ReorderPlanPresenter
     * @return {ReorderPlanPresenter}
     */
    public get reorderPlanPresenter(): ReorderPlanPresenter {
        return this._reorderPlanPresenter;
    }
}
