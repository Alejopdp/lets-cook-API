import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPlanList } from "./getPlanList";
import { GetPlanListDto } from "./getPlanListDto";

export class GetPlanListController extends BaseController {
    private _getPlanList: GetPlanList;

    constructor(getPlanList: GetPlanList) {
        super();
        this._getPlanList = getPlanList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPlanListDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getPlanList.execute(dto);

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
