import { BaseController } from "../../../../core/infra/BaseController";
import { Handle3dSecureFailureForManySubscriptions } from "./handle3dSecureFailureForManySubscriptions";
import { Handle3dSecureFailureForManySubscriptionsDto } from "./handle3dSecureFailureForManySubscriptionsDto";

export class Handle3dSecureFailureForManySubscriptionsController extends BaseController {
    private _handle3dSecureFailureForManySubscriptions: Handle3dSecureFailureForManySubscriptions;

    constructor(handle3dSecureFailureForManySubscriptions: Handle3dSecureFailureForManySubscriptions) {
        super();
        this._handle3dSecureFailureForManySubscriptions = handle3dSecureFailureForManySubscriptions;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: Handle3dSecureFailureForManySubscriptionsDto = {
                subscriptionsIds: this.req.body.subscriptionsIds,
                queryDate: new Date(),
            };

            await this.handle3dSecureFailureForManySubscriptions.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter handle3dSecureFailureForManySubscriptionsBilling
     * @return {Handle3dSecureFailureForManySubscriptions}
     */
    public get handle3dSecureFailureForManySubscriptions(): Handle3dSecureFailureForManySubscriptions {
        return this._handle3dSecureFailureForManySubscriptions;
    }
}
