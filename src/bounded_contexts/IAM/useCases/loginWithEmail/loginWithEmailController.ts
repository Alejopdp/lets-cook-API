import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { LoginWithEmail } from "./loginWithEmail";
import { LoginWithEmailDto } from "./loginWithEmailDto";

export class LoginWithEmailController extends BaseController {
    private useCase: LoginWithEmail;

    constructor(useCase: LoginWithEmail) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: LoginWithEmailDto = {
                email: this.req.body.email || "",
                password: this.req.body.password,
            };

            const result = await this.useCase.execute(dto);

            return this.ok(this.res, result);
        } catch (err) {
            return this.fail(err);
        }
    }
}
