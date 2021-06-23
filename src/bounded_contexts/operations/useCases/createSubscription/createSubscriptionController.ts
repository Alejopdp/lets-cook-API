import { BaseController } from "../../../../core/infra/BaseController";
import { CreateSubscription } from "./createSubscription";

export class CreateSubscriptionController extends BaseController {
    private _createSubscription: CreateSubscription;

    constructor(createSubscription: CreateSubscription) {
        super();
        this._createSubscription = createSubscription;
    }

    protected executeImpl(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    /**
     * Getter createSubscription
     * @return {CreateSubscription}
     */
    public get createSubscription(): CreateSubscription {
        return this._createSubscription;
    }
}
