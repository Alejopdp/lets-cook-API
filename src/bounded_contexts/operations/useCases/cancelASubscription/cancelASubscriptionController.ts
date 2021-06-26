import { BaseController } from "../../../../core/infra/BaseController";
import { CancelASubscription } from "./cancelASubscription";
import { CancelASubscriptionDto } from "./cancelASubscriptionDto";

export class CancelASubscriptionController extends BaseController {
    private _cancelASubscription: CancelASubscription;

    constructor(cancelASubscription: CancelASubscription) {
        super();
        this._cancelASubscription = cancelASubscription;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CancelASubscriptionDto = {
                subscriptionId: this.req.params.id,
                cancellationComment: this.req.body.cancellationComment,
                cancellationReason: this.req.body.cancellationReason,
            };
            await this.cancelASubscription.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter cancelASubscription
     * @return {CancelASubscription}
     */
    public get cancelASubscription(): CancelASubscription {
        return this._cancelASubscription;
    }
}
