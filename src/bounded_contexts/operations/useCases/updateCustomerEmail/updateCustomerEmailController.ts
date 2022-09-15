import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdateCustomerEmail } from "./updateCustomerEmail";
import { UpdateCustomerEmailDto } from "./updateCustomerEmailDto";
import { Address } from "../../domain/address/Address";

export class UpdateCustomerEmailController extends BaseController {
    private _updateCustomer: UpdateCustomerEmail;

    constructor(updateCustomer: UpdateCustomerEmail) {
        super();
        this._updateCustomer = updateCustomer;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateCustomerEmailDto = {
                token: this.req.body.token,
            };

            const result = await this.updateCustomer.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateCustomerEmail
     * @return {UpdateCustomerEmail}
     */
    public get updateCustomer(): UpdateCustomerEmail {
        return this._updateCustomer;
    }
}
