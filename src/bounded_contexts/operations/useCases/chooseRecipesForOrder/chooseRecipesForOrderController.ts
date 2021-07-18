import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { ChooseRecipesForOrder } from "./chooseRecipesForOrder";
import { ChooseRecipesForOrderDto } from "./chooseRecipesForOrderDto";

export class ChooseRecipesForOrderController extends BaseController {
    private _chooseRecipesForOrder: ChooseRecipesForOrder;

    constructor(chooseRecipesForOrder: ChooseRecipesForOrder) {
        super();
        this._chooseRecipesForOrder = chooseRecipesForOrder;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ChooseRecipesForOrderDto = {
                orderId: this.req.params.orderId,
                recipeSelection: this.req.body.recipeSelection,
                subscriptionId: this.req.body.subscriptionId,
            };

            await this.chooseRecipesForOrder.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter ChooseRecipesForOrder
     * @return {ChooseRecipesForOrder}
     */
    public get chooseRecipesForOrder(): ChooseRecipesForOrder {
        return this._chooseRecipesForOrder;
    }
}
