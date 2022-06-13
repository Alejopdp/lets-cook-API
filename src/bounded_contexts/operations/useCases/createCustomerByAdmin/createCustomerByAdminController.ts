import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { createCustomerDto } from "./createCustomerByAdminDto";
import fs from "fs";
import { CreateCustomerByAdmin } from "./createCustomerByAdmin";
import { logger } from "../../../../../config";
// import { CustomerSignUpPresenter } from "./customerSignUpPresenter";
// import { kml } from '@mapbox/togeojson';
var tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

export class CreateCustomerByAdminController extends BaseController {
    private _signUp: CreateCustomerByAdmin;

    constructor(signUp: CreateCustomerByAdmin) {
        super();
        this._signUp = signUp;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: createCustomerDto = {
                name: this.req.body.name,
                lastName: this.req.body.lastName,
                email: this.req.body.email,
                phone1: this.req.body.phone1,
                phone2: this.req.body.phone2,
                birthDate: this.req.body.bornDate,
                preferredLanguage: this.req.body.preferredLanguage,
                latShipping: this.req.body.latShipping,
                longShipping: this.req.body.longShipping,
                address: this.req.body.deliveryAddress,
                addressDetails: this.req.body.deliveryClarifications,
                addressPreferredSchedule: this.req.body.deliveryPreferredSchedule,
                latBilling: this.req.body.latBilling,
                longBilling: this.req.body.longBilling,
                billingAddressName: this.req.body.billingAddress,
                billingDetails: this.req.body.billingClarifications,
                customerName: this.req.body.billingName,
                identification: this.req.body.billingPersonalIdNumber,
                state: 'active',
                shippingCity: this.req.body.shippingCity ?? "",
                shippingProvince: this.req.body.shippingProvince ?? "",
                shippingPostalCode: this.req.body.shippingPostalCode ?? "",
                shippingCountry: this.req.body.shippingCountry ?? "",
                billingCity: this.req.body.billingCity ?? "",
                billingProvince: this.req.body.billingProvince ?? "",
                billingPostalCode: this.req.body.billingPostalCode ?? "",
                billingCountry: this.req.body.billingCountry ?? ""

            };

            const result = await this.signUp.execute(dto);
            // const presented = this.signUpPresenter.present(result);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter signUp
     * @return {CreateCustomerByAdmin}
     */
    public get signUp(): CreateCustomerByAdmin {
        return this._signUp;
    }

}
