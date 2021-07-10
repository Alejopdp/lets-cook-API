import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdateCustomer } from "./updateCustomer";
import { UpdateCustomerDto } from "./updateCustomerDto";
import { Address } from "../../domain/address/Address";

export class UpdateCustomerController extends BaseController {
    private _updateCustomer: UpdateCustomer;

    constructor(updateCustomer: UpdateCustomer) {
        super();
        this._updateCustomer = updateCustomer;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateCustomerDto = {
                customerId: this.req.params.id,
                email: this.req.body.email,
                isEmailVerified: this.req.body.isEmailVerified,
                stripeId: this.req.body.stripeId,
                password: this.req.body.password,
                state: this.req.body.state,
                billingAddress: (<any>Address)[this.req.body.billingData],
                shippingAddress: (<any>Address)[this.req.body.deliveryAddress],
                paymentMethods: this.req.body.paymentMethods
            };

            await this.updateCustomer.execute(dto);

            // if (recipeImagePath) {
            //     fs.unlinkSync(recipeImagePath);
            // }

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter UpdateCustomer
     * @return {UpdateRecipe}
     */
    public get updateCustomer(): UpdateCustomer {
        return this._updateCustomer;
    }
}
