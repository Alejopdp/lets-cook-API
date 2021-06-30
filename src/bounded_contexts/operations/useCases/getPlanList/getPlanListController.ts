import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPlanList } from "./getPlanList";
import { GetPlanListDto } from "./getPlanListDto";
import { GetPlanListPresenter } from "./getPlanListPresenter";

export class GetPlanListController extends BaseController {
    private _getPlanList: GetPlanList;
    private _getPlanListPresenter: GetPlanListPresenter;

    constructor(getPlanList: GetPlanList, getPlanListPresenter: GetPlanListPresenter) {
        super();
        this._getPlanList = getPlanList;
        this._getPlanListPresenter = getPlanListPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPlanListDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getPlanList.execute(dto);
            const presentedResult = await this.getPlanListPresenter.present(result);

            return this.ok(this.res, presentedResult);
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

    /**
     * Getter getPlanListPresenter
     * @return {GetPlanListPresenter}
     */
    public get getPlanListPresenter(): GetPlanListPresenter {
        return this._getPlanListPresenter;
    }
}
