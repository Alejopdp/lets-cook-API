import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPlanVariantsRecipesByWeekList } from "./getPlanVariantsRecipesByWeekList";
import { GetGetPlanVariantsRecipesByWeekListDto } from "./getPlanVariantsRecipesByWeekListDto";

export class GetPlanVariantsRecipesByWeekListController extends BaseController {
    private _getAdditionalPlanList: GetPlanVariantsRecipesByWeekList;

    constructor(getAdditionalPlanList: GetPlanVariantsRecipesByWeekList) {
        super();
        this._getAdditionalPlanList = getAdditionalPlanList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            // const dto: GetGetPlanVariantsRecipesByWeekListDto = {
            //     locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            // };
            const result = await this.getPlanVariantsRecipesByWeekList.execute();

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getAdditionalPlanList
     * @return {GetPlanVariantsRecipesByWeekList}
     */
    public get getPlanVariantsRecipesByWeekList(): GetPlanVariantsRecipesByWeekList {
        return this._getAdditionalPlanList;
    }
}
