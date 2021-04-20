import { BaseController } from "../../../../core/infra/BaseController";
import { GenerateNewPassword } from "./generateNewPassword";
import { GenerateNewPasswordDto } from "./generateNewPasswordDto";

export class GenerateNewPasswordController extends BaseController {
    private useCase: GenerateNewPassword;

    constructor(useCase: GenerateNewPassword) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: GenerateNewPasswordDto = {
                email: this.req.body.email,
                password: this.req.body.password,
            };

            await this.useCase.execute(dto);

            return this.ok(this.res);
        } catch (err) {
            return this.fail(err);
        }
    }
}
