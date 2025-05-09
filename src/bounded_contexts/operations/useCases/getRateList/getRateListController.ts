import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetRateList } from "./getRateList";
import { GetRateListDto } from "./getRateListDto";

export class GetRateListController extends BaseController {
    private _getRateList: GetRateList;

    constructor(getRateList: GetRateList) {
        super();
        this._getRateList = getRateList;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetRateListDto = {
                customerId: this.req.query.customer as string,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                queryDate: new Date()
            };
            const result = await this.getRateList.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
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
