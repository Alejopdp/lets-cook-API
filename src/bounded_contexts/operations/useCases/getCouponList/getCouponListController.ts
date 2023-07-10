import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCouponList } from "./getCouponList";
import { GetCouponListDto } from "./getCouponListDto";

export class GetCouponListController extends BaseController {
    private _getCouponList: GetCouponList;

    constructor(getCouponList: GetCouponList) {
        super();
        this._getCouponList = getCouponList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getCouponList.execute();

            return this.ok(this.res, result);
        } catch (error: any) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getCouponList
     * @return {GetCouponList}
     */
    public get getCouponList(): GetCouponList {
        return this._getCouponList;
    }
}
