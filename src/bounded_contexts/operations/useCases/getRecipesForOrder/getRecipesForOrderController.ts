import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetRecipesForOrder } from "./getRecipesForOrder";
import { GetRecipesForOrderDto } from "./getRecipesForOrderDto";
import { GetRecipesForOrderPresenter } from "./getRecipesForOrderPresenter";

export class GetRecipesForOrderController extends BaseController {
    private _getRecipesForOrder: GetRecipesForOrder;
    private _getRecipesForOrderPresenter: GetRecipesForOrderPresenter;

    constructor(getRecipesForOrder: GetRecipesForOrder, getRecipesForOrderPresenter: GetRecipesForOrderPresenter) {
        super();
        this._getRecipesForOrder = getRecipesForOrder;
        this._getRecipesForOrderPresenter = getRecipesForOrderPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetRecipesForOrderDto = {
                orderId: this.req.params.orderId,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const { recipes, order, subscription } = await this.getRecipesForOrder.execute(dto);
            const presented = await this.getRecipesForOrderPresenter.present(recipes, order, subscription);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getAdditionalPlanList
     * @return {GetRecipesForOrder}
     */
    public get getRecipesForOrder(): GetRecipesForOrder {
        return this._getRecipesForOrder;
    }

    /**
     * Getter getRecipesForOrderPresenter
     * @return {GetRecipesForOrderPresenter}
     */
    public get getRecipesForOrderPresenter(): GetRecipesForOrderPresenter {
        return this._getRecipesForOrderPresenter;
    }
}
