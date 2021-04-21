import { BaseController } from "../../../../core/infra/BaseController";
import { ForgotPassword } from "./forgotPassword";
import { ForgotPasswordDto } from "./forgotPasswordDto";

export class ForgotPasswordController extends BaseController {
    private _forgotPassword: ForgotPassword;

    constructor(forgotPassword: ForgotPassword) {
        super();
        this._forgotPassword = forgotPassword;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: ForgotPasswordDto = {
                id: parseInt(this.req.params.id),
            };

            await this.forgotPassword.execute(dto);

            return this.ok(this.res);
        } catch (err) {
            return this.fail(err);
        }
    }

    /**
     * Getter ForgotPassword
     * @return {ForgotPassword}
     */
    public get forgotPassword(): ForgotPassword {
        return this._forgotPassword;
    }
}
