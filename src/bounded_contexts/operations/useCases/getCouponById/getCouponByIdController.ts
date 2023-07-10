import { BaseController } from "../../../../core/infra/BaseController";
import { GetCouponById } from "./getCouponById";
import { GetCouponByIdDto } from "./getCouponByIdDto";

export class GetCouponByIdController extends BaseController {
    private _getCouponById: GetCouponById;

    constructor(getCouponById: GetCouponById) {
        super();
        this._getCouponById = getCouponById;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCouponByIdDto = {
                couponId: this.req.params.id,
            };
            const result = await this.getCouponById.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter getCouponById
     * @return {GetCouponById}
     */
    public get getCouponById(): GetCouponById {
        return this._getCouponById;
    }
}
