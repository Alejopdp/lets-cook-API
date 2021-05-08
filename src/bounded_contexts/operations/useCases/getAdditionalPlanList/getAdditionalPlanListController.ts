import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetAdditionalPlanList } from "./getAdditionalPlanList";
import { GetAdditionalPlanListDto } from "./getAdditionalPlanListDto";

export class GetAdditionalPlanListController extends BaseController {
    private _getAdditionalPlanList: GetAdditionalPlanList;

    constructor(getAdditionalPlanList: GetAdditionalPlanList) {
        super();
        this._getAdditionalPlanList = getAdditionalPlanList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetAdditionalPlanListDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getAdditionalPlanList.execute(dto);

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
