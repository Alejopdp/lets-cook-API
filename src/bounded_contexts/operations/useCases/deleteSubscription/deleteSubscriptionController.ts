import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteSubscription } from "./deleteSubscription";
import { DeleteSubscriptionDto } from "./deleteSubscriptionDto";

export class DeleteSubscriptionController extends BaseController {
    private _deleteSubscription: DeleteSubscription;

    constructor(deleteSubscription: DeleteSubscription) {
        super();
        this._deleteSubscription = deleteSubscription;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteSubscriptionDto = {
                subscriptionId: this.req.params.id,
            };

            await this.deleteSubscription.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteSubscription
     * @return {DeleteSubscription}
     */
    public get deleteSubscription(): DeleteSubscription {
        return this._deleteSubscription;
    }
}
