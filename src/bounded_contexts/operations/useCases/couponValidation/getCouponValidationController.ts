import { BaseController } from "../../../../core/infra/BaseController";
import { GetCouponValidation } from "./getCouponValidation";
import { GetCouponValidationDto } from "./getCouponValidationDto";

export class GetCouponValidationController extends BaseController {
    private _getCouponValidation: GetCouponValidation;

    constructor(getCouponValidation: GetCouponValidation) {
        super();
        this._getCouponValidation = getCouponValidation;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCouponValidationDto = {
                coupon: this.req.params.code,
                customerId: this.req.body.customerId,
            };
            const result = await this.getCouponValidation.execute(dto);

            return this.ok(this.res, result);
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
}
