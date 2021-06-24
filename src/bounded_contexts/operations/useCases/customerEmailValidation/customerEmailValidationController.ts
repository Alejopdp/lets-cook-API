import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { CustomerEmailValidationDto } from "./customerEmailValidationDto";
import fs from "fs";
import { CustomerEmailValidation } from "./customerEmailValidation";
import { logger } from "../../../../../config";
// import { kml } from '@mapbox/togeojson';
var tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

export class CustomerEmailValidationController extends BaseController {
    private _customerEmailValidation: CustomerEmailValidation;

    constructor(customerEmailValidation: CustomerEmailValidation) {
        super();
        this._customerEmailValidation = customerEmailValidation;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CustomerEmailValidationDto = {
                email: this.req.params.email
            };

            const result = await this.customerEmailValidation.execute(dto);

            return this.ok(this.res, {emailExist: result});
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter customerEmailValidation
     * @return {CustomerEmailValidation}
     */
    public get customerEmailValidation(): CustomerEmailValidation {
        return this._customerEmailValidation;
    }
}
