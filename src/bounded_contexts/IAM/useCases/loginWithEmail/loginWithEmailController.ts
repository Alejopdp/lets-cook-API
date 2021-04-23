import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Either, Failure } from "../../../../core/logic/Result";
import { LoginWithEmail } from "./loginWithEmail";
import { LoginWithEmailDto } from "./loginWithEmailDto";
import { LoginWithEmailErrors } from "./loginWithEmailErrors";

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

            const result: Either<Failure<LoginWithEmailErrors>, any> = await this.useCase.execute(dto);

            if (result.isLeft()) {
                const error = result.value;

                switch (error.type) {
                    case LoginWithEmailErrors.InvalidArguments:
                        return this.clientError(error.reason);
                    case LoginWithEmailErrors.InactiveUser:
                        return this.conflict(error.reason);
                    default:
                        return this.fail(error.reason);
                }
            }

            return this.ok(this.res, result.value);
        } catch (err) {
            return this.fail(err);
        }
    }
}
