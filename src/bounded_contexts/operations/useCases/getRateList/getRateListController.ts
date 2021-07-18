import { BaseController } from "../../../../core/infra/BaseController";
import { GetRateList } from "./getRateList";

export class GetRateListController extends BaseController {
    private _getRateList: GetRateList;

    constructor(getRateList: GetRateList) {
        super();
        this._getRateList = getRateList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getRateList.execute();

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getRecipeList
     * @return {GetRateList}
     */
    public get getRateList(): GetRateList {
        return this._getRateList;
    }
}
