import { BaseController } from "../../../../core/infra/BaseController";
import { ChangeSubscriptionPlanVariant } from "./changeSubscriptionPlanVariant";

export class ChangeSubscriptionPlanVariantController extends BaseController {
    private _changeSubscriptionPlanVariant: ChangeSubscriptionPlanVariant;

    constructor(changeSubscriptionPlanVariant: ChangeSubscriptionPlanVariant) {
        super();
        this._changeSubscriptionPlanVariant = changeSubscriptionPlanVariant;
    }

    protected executeImpl(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    /**
     * Getter changeSubscriptionPlanVariant
     * @return {ChangeSubscriptionPlanVariant}
     */
    public get changeSubscriptionPlanVariant(): ChangeSubscriptionPlanVariant {
        return this._changeSubscriptionPlanVariant;
    }
}
