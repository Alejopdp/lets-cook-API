import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateSubscriptionCoupon } from "./updateSubscriptionCoupon";
import { UpdateSubscriptionCouponDto } from "./updateSubscriptionCouponDto";

export class UpdateSubscriptionCouponController extends BaseController {
    private _updateSubscriptionCoupon: UpdateSubscriptionCoupon;

    constructor(updateSubscriptionCoupon: UpdateSubscriptionCoupon) {
        super();
        this._updateSubscriptionCoupon = updateSubscriptionCoupon;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateSubscriptionCouponDto = {
                subscriptionId: this.req.params.id,
                couponCode: this.req.body.couponCode,
                customerId: this.req.body.customerId,
            };

            await this.updateSubscriptionCoupon.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter UpdateSubscriptionCoupon
     * @return {UpdateSubscriptionCoupon}
     */
    public get updateSubscriptionCoupon(): UpdateSubscriptionCoupon {
        return this._updateSubscriptionCoupon;
    }
}
