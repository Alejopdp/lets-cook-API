import { createCoupon } from './index';
import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreateCouponDto } from "./createCouponDto";
import fs from "fs";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { CreateCoupon } from "./createCoupon";
import { logger } from "../../../../../config";
import { Locale } from "../../domain/locale/Locale";
import { PlanId } from "../../domain/plan/PlanId";

export class CreateCouponController extends BaseController {
    private _createCoupon: CreateCoupon;

    constructor(createCoupon: CreateCoupon) {
        super();
        this._createCoupon = createCoupon;
    }

    protected async executeImpl(): Promise<any> {
        try {
            // console.log("Body: ",this.req.body)
            // if (!this.req.file) throw new Error("No ha ingresado una imagen para el plan");
            // const planImagePath = this.req.file.path;
            // const planImage: ReadStream = fs.createReadStream(planImagePath);

            const dto: CreateCouponDto = {
                couponCode: this.req.body.code,
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
                state: this.req.body.state
            };
            // console.log("CreateCouponController: ", dto)

            await this.createCoupon.execute(dto);

            // fs.unlinkSync(planImagePath);

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
