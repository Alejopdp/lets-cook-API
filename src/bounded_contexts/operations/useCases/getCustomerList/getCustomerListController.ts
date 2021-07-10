import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCustomerList } from "./getCustomerList";
// import { GetCouponListDto } from "./getCustomerListDto";

export class GetCustomerListController extends BaseController {
    private _getCustomerList: GetCustomerList;

    constructor(getCustomerList: GetCustomerList) {
        super();
        this._getCustomerList = getCustomerList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getCustomerList.execute();

            return this.ok(this.res, result);
        } catch (error) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getCustomerList
     * @return {GetCustomerList}
     */
    public get getCustomerList(): GetCustomerList {
        return this._getCustomerList;
    }
}
