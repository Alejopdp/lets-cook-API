import { BaseController } from "../../../../core/infra/BaseController";
import { GetRecipeList } from "./getRecipeList";

export class GetRecipeListController extends BaseController {
    private _getRecipeList: GetRecipeList;

    constructor(getRecipeList: GetRecipeList) {
        super();
        this._getRecipeList = getRecipeList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getRecipeList.execute();

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getRecipeList
     * @return {GetRecipeList}
     */
    public get getRecipeList(): GetRecipeList {
        return this._getRecipeList;
    }
}
