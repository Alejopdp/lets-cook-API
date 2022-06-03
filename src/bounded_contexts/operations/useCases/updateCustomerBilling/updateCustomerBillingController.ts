import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdateCustomerBilling } from "./updateCustomerBilling";
import { UpdateCustomerBillingDto } from "./updateCustomerBillingDto";
import { Address } from "../../domain/address/Address";

export class UpdateCustomerBillingController extends BaseController {
    private _updateCustomer: UpdateCustomerBilling;

    constructor(updateCustomer: UpdateCustomerBilling) {
        super();
        this._updateCustomer = updateCustomer;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateCustomerBillingDto = {
                customerId: this.req.params.id,
                lat: this.req.body.latitude,
                long: this.req.body.longitude,
                addressName: this.req.body.addressName,
                customerName: this.req.body.customerName,
                details: this.req.body.details,
                billingId: this.req.body.billingId,
                identification: this.req.body.identification,
                //@ts-ignore
                nameOrEmailOfAdminExecutingRequest: this.req.currentUser?.role ? this.req.currentUser.getFullName() : undefined,
            };

            await this.updateCustomer.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateCustomerBilling
     * @return {UpdateCustomerBilling}
     */
    public get updateCustomer(): UpdateCustomerBilling {
        return this._updateCustomer;
    }
}
