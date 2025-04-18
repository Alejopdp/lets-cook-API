import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdateCustomerShipping } from "./updateCustomerShipping";
import { UpdateCustomerShippingDto } from "./updateCustomerShippingDto";
import { Address } from "../../domain/address/Address";

export class UpdateCustomerShippingController extends BaseController {
    private _updateCustomer: UpdateCustomerShipping;

    constructor(updateCustomer: UpdateCustomerShipping) {
        super();
        this._updateCustomer = updateCustomer;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateCustomerShippingDto = {
                customerId: this.req.params.id,
                lat: this.req.body.lat,
                long: this.req.body.long,
                name: this.req.body.name,
                fullName: this.req.body.full_name,
                details: this.req.body.details,
                addressId: this.req.body.addresId,
                deliveryTime: this.req.body.delivery_time,
                //@ts-ignore
                nameOrEmailOfAdminExecutingRequest: this.req.currentUser?.role ? this.req.currentUser.getFullName() : undefined,
                city: this.req.body.city ?? "",
                province: this.req.body.province ?? "",
                postalCode: this.req.body.postalCode ?? "",
                country: this.req.body.country ?? ""
            };

            await this.updateCustomer.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateCustomerShipping
     * @return {UpdateCustomerShipping}
     */
    public get updateCustomer(): UpdateCustomerShipping {
        return this._updateCustomer;
    }
}
