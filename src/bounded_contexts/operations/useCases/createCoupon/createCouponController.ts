import { BaseController } from "../../../../core/infra/BaseController";
import { CreateCouponDto } from "./createCouponDto";
import fs from "fs";
import { CreateCoupon } from "./createCoupon";
import { Locale } from "../../domain/locale/Locale";

export class CreateCouponController extends BaseController {
    private _createCoupon: CreateCoupon;

    constructor(createCoupon: CreateCoupon) {
        super();
        this._createCoupon = createCoupon;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CreateCouponDto = {
                couponCode: this.req.body.couponCode,
                discountType: this.req.body.discount_type.type,
                discountValue: this.req.body.discount_type.value,
                minRequireType: this.req.body.minimum_requirement.type,
                minRequireValue: this.req.body.minimum_requirement.value,
                productsForApplyingType: this.req.body.apply_to.type,
                productsForApplyingValue: this.req.body.apply_to.value,
                limites: this.req.body.application_limit,
                maxChargeQtyType: this.req.body.coupons_by_subscription.type,
                maxChargeQtyValue: this.req.body.coupons_by_subscription.value,
                startDate: this.req.body.date_rage.start,
                endDate: this.req.body.date_rage.expire,
                state: this.req.body.state,
            };

            await this.createCoupon.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter createPlan
     * @return {CreateCoupon}
     */
    public get createCoupon(): CreateCoupon {
        return this._createCoupon;
    }
}
