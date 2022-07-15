import { BaseController } from "../../../../core/infra/BaseController";
import { CodeValidationDto } from "./codeValidationDto";
import { CodeValidation } from "./codeValidation";

export class CodeValidationController extends BaseController {
    private _codeValidation: CodeValidation;

    constructor(codeValidation: CodeValidation) {
        super();
        this._codeValidation = codeValidation;
    }

    protected async executeImpl(): Promise<any> {
        try {
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
