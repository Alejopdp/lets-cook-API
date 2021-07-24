import { BaseController } from "../../../../core/infra/BaseController";
import { GetCouponValidationPresenter } from "./getCouponValidationPresenter";
import { GetCouponValidation } from "./getCouponValidation";
import { GetCouponValidationDto } from "./getCouponValidationDto";

export class GetCouponValidationController extends BaseController {
    private _getCouponValidation: GetCouponValidation;
    private _getCouponValidationPresenter: GetCouponValidationPresenter;

    constructor(getCouponValidation: GetCouponValidation, getCouponValidationPresenter: GetCouponValidationPresenter) {
        super();
        this._getCouponValidation = getCouponValidation;
        this._getCouponValidationPresenter = getCouponValidationPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCouponValidationDto = {
                coupon: this.req.params.code,
                customerId: this.req.query.customerId as string,
                shippingCost: parseInt(this.req.query.shippingCost as string),
                planId: this.req.query.planId as string,
                planVariantId: this.req.query.planVariantId as string,
            };
            const result = await this.getCouponValidation.execute(dto);
            const presented = this.getCouponValidationPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getCouponById
     * @return {GetCouponValidation}
     */
    public get getCouponValidation(): GetCouponValidation {
        return this._getCouponValidation;
    }

    /**
     * Getter getCouponValidationPresenter
     * @return {GetCouponValidationPresenter}
     */
    public get getCouponValidationPresenter(): GetCouponValidationPresenter {
        return this._getCouponValidationPresenter;
    }
}
