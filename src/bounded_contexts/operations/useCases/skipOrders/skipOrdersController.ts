import { BaseController } from "../../../../core/infra/BaseController";
import { SkipOrders } from "./skipOrders";
import { SkipOrdersDto } from "./skipOrdersDto";

export class SkipOrdersController extends BaseController {
    private _skipOrders: SkipOrders;

    constructor(skipOrders: SkipOrders) {
        super();
        this._skipOrders = skipOrders;
    }

    protected async executeImpl(): Promise<any> {
        try {
            console.log("EL BODY: ", this.req.body);
            const dto: SkipOrdersDto = {
                ordersIds: this.req.body.ordersIds,
                ordersToSkip: this.req.body.ordersToSkip,
                ordersToReactivate: this.req.body.ordersToReactivate,
            };
            const result = await this.skipOrders.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {SkipOrders}
     */
    public get skipOrders(): SkipOrders {
        return this._skipOrders;
    }
}
