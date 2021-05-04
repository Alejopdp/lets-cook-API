import { BaseController } from "../../../../core/infra/BaseController";
import { GetAdditionalPlanList } from "./getAdditionalPlanList";

export class GetAdditionalPlanListController extends BaseController {
    private _getAdditionalPlanList: GetAdditionalPlanList;

    constructor(getAdditionalPlanList: GetAdditionalPlanList) {
        super();
        this._getAdditionalPlanList = getAdditionalPlanList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getAdditionalPlanList.execute();

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getAdditionalPlanList
     * @return {GetAdditionalPlanList}
     */
    public get getAdditionalPlanList(): GetAdditionalPlanList {
        return this._getAdditionalPlanList;
    }
}
