import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetPlanList } from "./getPlanList";

export class GetPlanListController extends BaseController {
    private _getPlanList: GetPlanList;

    constructor(getPlanList: GetPlanList) {
        super();
        this._getPlanList = getPlanList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getPlanList.execute();

            return this.ok(this.res, result);
        } catch (error) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getPlanList
     * @return {GetPlanList}
     */
    public get getPlanList(): GetPlanList {
        return this._getPlanList;
    }
}
