import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { CodeValidationDto } from "./codeValidationDto";
import fs from "fs";
import { CodeValidation } from "./codeValidation";
import { logger } from "../../../../../config";
// import { kml } from '@mapbox/togeojson';
var tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

export class CodeValidationController extends BaseController {
    private _codeValidation: CodeValidation;

    constructor(codeValidation: CodeValidation) {
        super();
        this._codeValidation = codeValidation;
    }

    protected async executeImpl(): Promise<any> {
        try {
            // console.log(this.req.body.email, this.req.params.code)
            const dto: CodeValidationDto = {
                email: this.req.body.email,
                code: this.req.params.code
            };

            const result = await this.codeValidation.execute(dto);

            return this.ok(this.res, { code_validation: result });
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter codeValidation
     * @return {CodeValidation}
     */
    public get codeValidation(): CodeValidation {
        return this._codeValidation;
    }
}
