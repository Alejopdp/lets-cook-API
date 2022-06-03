import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { UpdatePasswordDto } from "./updatePasswordDto";
import fs from "fs";
import { UpdatePassword } from "./updatePassword";

export class UpdatePasswordController extends BaseController {
    private _updatePassword: UpdatePassword;

    constructor(updatePassword: UpdatePassword) {
        super();
        this._updatePassword = updatePassword;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdatePasswordDto = {
                email: this.req.params.email,
                newPassword: this.req.body.newPassword,
                code: this.req.body.code
            };

            await this.signUp.execute(dto);

            // fs.unlinkSync(planImagePath);

            return this.ok(this.res, { result: "Successfully modified" });
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updatePassword
     * @return {UpdatePassword}
     */
    public get signUp(): UpdatePassword {
        return this._updatePassword;
    }
}
