import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetAdditionalPlanList } from "./getAdditionalPlanList";
import { GetAdditionalPlanListDto } from "./getAdditionalPlanListDto";
import { GetAdditionalPlanListPresenter } from "./getAdditionalPlanListPresenter";

export class GetAdditionalPlanListController extends BaseController {
    private _getAdditionalPlanList: GetAdditionalPlanList;
    private _getAdditionalPlanListPresenter: GetAdditionalPlanListPresenter;

    constructor(getAdditionalPlanList: GetAdditionalPlanList, getAdditionalPlanListPresenter: GetAdditionalPlanListPresenter) {
        super();
        this._getAdditionalPlanList = getAdditionalPlanList;
        this._getAdditionalPlanListPresenter = getAdditionalPlanListPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetAdditionalPlanListDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getAdditionalPlanList.execute(dto);
            const presentedResult = await this.getAdditionalPlanListPresenter.present(result)

            return this.ok(this.res, presentedResult);
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

    /**
     * Getter getAdditionalPlanListPresenter
     * @return {GetAdditionalPlanListPresenter}
     */
    public get getAdditionalPlanListPresenter(): GetAdditionalPlanListPresenter {
        return this._getAdditionalPlanListPresenter;
    }
}
