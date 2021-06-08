import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { UpdateCoupon } from "./updateCouponState";
import { UpdateCuponStateDto } from "./updateCouponStateDto";
import fs from "fs";
import { Locale } from "../../domain/locale/Locale";

export class UpdateCouponStateController extends BaseController {
    private _updateCouponState: UpdateCoupon;

    constructor(updateCouponState: UpdateCoupon) {
        super();
        this._updateCouponState = updateCouponState;
    }

    protected async executeImpl(): Promise<any> {
        try {
            // var planImagePath = "";
            // var planImage: ReadStream | undefined;
            // var planImageFileName: string = "";

            // if (this.req.file) {
            //     planImagePath = this.req.file.path;
            //     planImage = fs.createReadStream(planImagePath);
            //     planImageFileName = this.req.file.originalname;
            // }

            const dto: UpdateCuponStateDto = {
                id: this.req.params.id,
                // couponCode: this.req.body.code,
                // discountType: this.req.body.discount_type.type,
                // discountValue: this.req.body.discount_type.value,
                // minRequireType: this.req.body.minimum_requirement.type,
                // minRequireValue: this.req.body.minimum_requirement.value,
                // productsForApplyingType: this.req.body.apply_to.type,
                // productsForApplyingValue: this.req.body.apply_to.value,
                // limites: this.req.body.application_limit,
                // maxChargeQtyType: this.req.body.coupons_by_subscription.type,
                // maxChargeQtyValue: this.req.body.coupons_by_subscription.value,
                // startDate: this.req.body.date_rage.start,
                // endDate: this.req.body.date_rage.expire,
                state: this.req.body.state
            };

            await this.updateCouponState.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter updatePlan
     * @return {UpdatePlan}
     */
    public get updateCouponState(): UpdateCoupon {
        return this._updateCouponState;
    }
}
