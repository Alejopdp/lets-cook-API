import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetRecipeList } from "./getRecipeList";
import { GetRecipeListDto } from "./getRecipeListDto";

export class GetRecipeListController extends BaseController {
    private _getRecipeList: GetRecipeList;

    constructor(getRecipeList: GetRecipeList) {
        super();
        this._getRecipeList = getRecipeList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetRecipeListDto = { locale: (<any>Locale)[this.req.query.locale as string] || Locale.es };
            const result = await this.getRecipeList.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
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
