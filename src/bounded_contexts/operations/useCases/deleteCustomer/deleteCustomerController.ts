import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteCustomer } from "./deleteCustomer";
import { DeleteCustomerDto } from "./deleteCustomerDto";

export class DeleteCustomerController extends BaseController {
    private _deleteCustomer: DeleteCustomer;

    constructor(deleteCustomer: DeleteCustomer) {
        super();
        this._deleteCustomer = deleteCustomer;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteCustomerDto = {
                customerId: this.req.params.id,
            };

            await this.deleteCustomer.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteCustomer
     * @return {DeleteCustomer}
     */
    public get deleteCustomer(): DeleteCustomer {
        return this._deleteCustomer;
    }
}
