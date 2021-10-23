import { BaseController } from "../../../../core/infra/BaseController";
import { ApplyCouponToSubscription } from "./applyCouponToSubscription";
import { ApplyCouponToSubscriptionDto } from "./applyCouponToSubscriptionDto";

export class ApplyCouponToSubscriptionController extends BaseController {
    private _applyCouponToSubscription: ApplyCouponToSubscription;

    constructor(applyCouponToSubscription: ApplyCouponToSubscription) {
        super();
        this._applyCouponToSubscription = applyCouponToSubscription;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ApplyCouponToSubscriptionDto = {
                subscriptionId: this.req.params.id,
                couponCode: this.req.body.couponCode,
                customerId: this.req.body.customerId,
            };
            await this.applyCouponToSubscription.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter applyCouponToSubscription
     * @return {ApplyCouponToSubscription}
     */
    public get applyCouponToSubscription(): ApplyCouponToSubscription {
        return this._applyCouponToSubscription;
    }
}
