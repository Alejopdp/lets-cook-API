import { BaseController } from "../../../../core/infra/BaseController";
import { CancelASubscription } from "./cancelASubscription";

export class CancelASubscriptionController extends BaseController {
    private _cancelASubscription: CancelASubscription;

    constructor(cancelASubscription: CancelASubscription) {
        super();
        this._cancelASubscription = cancelASubscription;
    }

    protected executeImpl(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    /**
     * Getter cancelASubscription
     * @return {CancelASubscription}
     */
    public get cancelASubscription(): CancelASubscription {
        return this._cancelASubscription;
    }
}
