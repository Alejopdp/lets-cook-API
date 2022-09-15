import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetShippingZoneList } from "./getShippingZoneList";
import { GetShippingZoneListDto } from "./getShippingZoneListDto";

export class GetShippingListController extends BaseController {
    private _getShippingZoneList: GetShippingZoneList;

    constructor(getShippingZoneList: GetShippingZoneList) {
        super();
        this._getShippingZoneList = getShippingZoneList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getShippingZoneList.execute();

            return this.ok(this.res, result);
        } catch (error: any) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getCouponList
     * @return {GetShippingZoneList}
     */
    public get getShippingZoneList(): GetShippingZoneList {
        return this._getShippingZoneList;
    }
}
