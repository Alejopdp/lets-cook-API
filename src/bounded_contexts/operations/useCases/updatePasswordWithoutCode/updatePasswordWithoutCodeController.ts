import { BaseController } from "../../../../core/infra/BaseController";
import { UpdatePasswordWithoutCodeDto } from "./updatePasswordWithoutCodeDto";
import { UpdatePasswordWithoutCode } from "./updatePasswordWithoutCode";

export class UpdatePasswordWithoutCodeController extends BaseController {
    private _updatePasswordWithoutCode: UpdatePasswordWithoutCode;

    constructor(updatePasswordWithoutCode: UpdatePasswordWithoutCode) {
        super();
        this._updatePasswordWithoutCode = updatePasswordWithoutCode;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdatePasswordWithoutCodeDto = {
                email: this.req.params.email,
                newPassword: this.req.body.newPassword,
                //@ts-ignore
                emailOfRequester: this.req.currentUser.email,
            };

            await this.updatePasswordWithoutCode.execute(dto);

            // fs.unlinkSync(planImagePath);

            return this.ok(this.res, { result: "Successfully modified" });
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter updatePasswordWithoutCode
     * @return {UpdatePasswordWithoutCode}
     */
    public get updatePasswordWithoutCode(): UpdatePasswordWithoutCode {
        return this._updatePasswordWithoutCode;
    }
}
