import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdateCustomerInfo } from "./updateCustomerInfo";
import { UpdateCustomerInfoDto } from "./updateCustomerInfoDto";
import { Address } from "../../domain/address/Address";

export class UpdateCustomerInfoController extends BaseController {
    private _updateCustomer: UpdateCustomerInfo;

    constructor(updateCustomer: UpdateCustomerInfo) {
        super();
        this._updateCustomer = updateCustomer;
    }

    protected async executeImpl(): Promise<any> {
        console.log("Birth date: ", this.req.body.birthDate);
        try {
            const dto: UpdateCustomerInfoDto = {
                customerId: this.req.params.id,
                name: this.req.body.name,
                lastName: this.req.body.lastName,
                phone1: this.req.body.phone1,
                phone2: this.req.body.phone2,
                birthDate: this.req.body.birthDate,
                preferredLanguage: this.req.body.preferredLanguage
            };

            await this.updateCustomer.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateCustomerBilling
     * @return {UpdateCustomerInfo}
     */
    public get updateCustomer(): UpdateCustomerInfo {
        return this._updateCustomer;
    }
}
