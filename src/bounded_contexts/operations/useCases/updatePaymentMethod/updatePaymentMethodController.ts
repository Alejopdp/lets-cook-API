import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdatePaymentMethod } from "./updatePaymentMethod";
import { UpdatePaymentMethodDto } from "./updatePaymentMethodDto";
import { Address } from "../../domain/address/Address";

export class UpdatePaymentMethodController extends BaseController {
    private _updateCustomer: UpdatePaymentMethod;

    constructor(updateCustomer: UpdatePaymentMethod) {
        super();
        this._updateCustomer = updateCustomer;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdatePaymentMethodDto = {
                customerId: this.req.params.id,
                brand: this.req.body.brand,
                last4Numbers: this.req.body.last4Numbers,
                exp_month: this.req.body.exp_month,
                exp_year: this.req.body.exp_year,
                cvc: this.req.body.cvc,
                stripeId: this.req.body.stripeId,
                isDefault: this.req.body.isDefault,
                paymentId: this.req.body.id ? this.req.body.id : null,
                //@ts-ignore
                nameOrEmailOfAdminExecutingRequest: this.req.currentUser?.role ? this.req.currentUser.getFullName() : undefined,
            };

            await this.updateCustomer.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateCustomerBilling
     * @return {UpdatePaymentMethod}
     */
    public get updateCustomer(): UpdatePaymentMethod {
        return this._updateCustomer;
    }
}
