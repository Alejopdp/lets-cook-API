import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPlanVariantsRecipesByWeekList } from "./getPlanVariantsRecipesByWeekList";
import { GetPlanVariantsRecipesByWeekListDto } from "./getPlanVariantsRecipesByWeekListDto";
import { GetPlanVariantsRecipesByWeekListPresenter } from "./getPlanVariantsRecipesByWeekListPresenter";

export class GetPlanVariantsRecipesByWeekListController extends BaseController {
    private _getAdditionalPlanList: GetPlanVariantsRecipesByWeekList;
    private _getPlanVariantsRecipesByWeekListPresenter: GetPlanVariantsRecipesByWeekListPresenter;

    constructor(
        getAdditionalPlanList: GetPlanVariantsRecipesByWeekList,
        getPlanVariantsRecipesByWeekListPresenter: GetPlanVariantsRecipesByWeekListPresenter
    ) {
        super();
        this._getAdditionalPlanList = getAdditionalPlanList;
        this._getPlanVariantsRecipesByWeekListPresenter = getPlanVariantsRecipesByWeekListPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPlanVariantsRecipesByWeekListDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getPlanVariantsRecipesByWeekList.execute(dto);
            const presented = await this.getPlanVariantsRecipesByWeekListPresenter.present(
                result.plans,
                result.recipes,
                result.week,
                dto.locale
            );

            return this.ok(this.res, presented);
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

    /**
     * Getter getAdditionalPlanList
     * @return {GetPlanVariantsRecipesByWeekList}
     */
    public get getAdditionalPlanList(): GetPlanVariantsRecipesByWeekList {
        return this._getAdditionalPlanList;
    }

    /**
     * Getter getPlanVariantsRecipesByWeekListPresenter
     * @return {GetPlanVariantsRecipesByWeekListPresenter}
     */
    public get getPlanVariantsRecipesByWeekListPresenter(): GetPlanVariantsRecipesByWeekListPresenter {
        return this._getPlanVariantsRecipesByWeekListPresenter;
    }
}
