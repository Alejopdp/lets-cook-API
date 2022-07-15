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
            const dto: SkipOrdersDto = {
                ordersToSkip: this.req.body.ordersToSkip,
                ordersToReactivate: this.req.body.ordersToReactivate,
                //@ts-ignore
                nameOrEmailOfAdminExecutingRequest: this.req.currentUser?.role ? this.req.currentUser.getFullName() : undefined,
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
