import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteCoupon } from "./deleteCoupon";
import { DeleteCouponDto } from "./deleteCouponDto";

export class DeleteCouponController extends BaseController {
    private _deleteCoupon: DeleteCoupon;

    constructor(deleteCoupon: DeleteCoupon) {
        super();
        this._deleteCoupon = deleteCoupon;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteCouponDto = {
                couponId: this.req.params.id,
            };

            await this.deleteCoupon.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteCoupon
     * @return {DeleteCoupon}
     */
    public get deleteCoupon(): DeleteCoupon {
        return this._deleteCoupon;
    }
}
