import { BaseController } from "../../../../core/infra/BaseController";
import { SwapSubscriptionPlan } from "./swapSubscriptionPlan";
import { SwapSubscriptionPlanDto } from "./swapSubscriptionPlanDto";

export class SwapSubscriptionPlanController extends BaseController {
    private _swapSubscriptionPlan: SwapSubscriptionPlan;

    constructor(swapSubscriptionPlan: SwapSubscriptionPlan) {
        super();
        this._swapSubscriptionPlan = swapSubscriptionPlan;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: SwapSubscriptionPlanDto = {
                subscriptionId: this.req.params.id,
                newPlanId: this.req.body.newPlanId,
                newPlanVariantId: this.req.body.newPlanVariantId,
            };

            await this.swapSubscriptionPlan.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {SwapSubscriptionPlan}
     */
    public get swapSubscriptionPlan(): SwapSubscriptionPlan {
        return this._swapSubscriptionPlan;
    }
}
