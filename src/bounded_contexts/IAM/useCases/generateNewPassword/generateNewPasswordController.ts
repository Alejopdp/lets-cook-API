import { BaseController } from "../../../../core/infra/BaseController";
import { GenerateNewPassword } from "./generateNewPassword";
import { GenerateNewPasswordDto } from "./generateNewPasswordDto";
import { GenerateNewPasswordErrors } from "./generateNewPasswordErrors";

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

            const result = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.type) {
                    case GenerateNewPasswordErrors.InvalidArguments:
                        return this.clientError(error.reason);
                    default:
                        return this.fail(error.reason);
                }
            }

            return this.ok(this.res);
        } catch (err: any) {
            return this.fail(err);
        }
    }
}
