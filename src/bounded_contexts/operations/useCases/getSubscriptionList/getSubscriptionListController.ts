import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetSubscriptionList } from "./getSubscriptionList";
import { GetSubscriptionListDto } from "./getSubscriptionListDto";
import { GetSubscriptionListPresenter } from "./getSubscriptionListPresenter";

export class GetSubscriptionListController extends BaseController {
    private _getSubscriptionList: GetSubscriptionList;
    private _getSubscriptionListPresenter: GetSubscriptionListPresenter;

    constructor(getSubscriptionList: GetSubscriptionList, getSubscriptionListPresenter: GetSubscriptionListPresenter) {
        super();
        this._getSubscriptionList = getSubscriptionList;
        this._getSubscriptionListPresenter = getSubscriptionListPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetSubscriptionListDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getSubscriptionList.execute(dto);
            const presented = this.getSubscriptionListPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetSubscriptionList}
     */
    public get getSubscriptionList(): GetSubscriptionList {
        return this._getSubscriptionList;
    }

    /**
     * Getter getSubscriptionListPresenter
     * @return {GetSubscriptionListPresenter}
     */
    public get getSubscriptionListPresenter(): GetSubscriptionListPresenter {
        return this._getSubscriptionListPresenter;
    }
}
