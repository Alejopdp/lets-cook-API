import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteCustomerSubscriptionsAndOrders } from "./deleteCustomerSubscriptionsAndOrders";
import { DeleteCustomerSubscriptionsAndOrdersDto } from "./deleteCustomerSubscriptionsAndOrdersDto";

export class DeleteCustomerSubscriptionsAndOrdersController extends BaseController {
    private _deleteCustomer: DeleteCustomerSubscriptionsAndOrders;

    constructor(deleteCustomerSubscriptionsAndOrders: DeleteCustomerSubscriptionsAndOrders) {
        super();
        this._deleteCustomer = deleteCustomerSubscriptionsAndOrders;
    }

    protected async executeImpl(): Promise<any> {
        try {
            if (!this.req.params.id) throw new Error("No ingreso un id de un cliente")
            const dto: DeleteCustomerSubscriptionsAndOrdersDto = {
                customerId: this.req.params.id,
            };

            await this.deleteCustomerSubscriptionsAndOrders.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error as Error);
        }
    }

    /**
     * Getter deleteCustomerSubscriptionsAndOrders
     * @return {DeleteCustomerSubscriptionsAndOrders}
     */
    public get deleteCustomerSubscriptionsAndOrders(): DeleteCustomerSubscriptionsAndOrders {
        return this._deleteCustomer;
    }
}
