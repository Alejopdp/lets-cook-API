import { BaseController } from "../../../../core/infra/BaseController";
import { ChangeSubscriptionFrequency } from "./changeSubscriptionFrequency";

export class ChangeSubscriptionFrequencyController extends BaseController {
    private _changeSubscriptionFrequency: ChangeSubscriptionFrequency;

    constructor(changeSubscriptionFrequency: ChangeSubscriptionFrequency) {
        super();
        this._changeSubscriptionFrequency = changeSubscriptionFrequency;
    }

    protected executeImpl(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    /**
     * Getter changeSubscriptionFrequency
     * @return {ChangeSubscriptionFrequency}
     */
    public get changeSubscriptionFrequency(): ChangeSubscriptionFrequency {
        return this._changeSubscriptionFrequency;
    }
}
