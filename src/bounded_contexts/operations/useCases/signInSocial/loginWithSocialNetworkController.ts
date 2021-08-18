import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Either, Failure } from "../../../../core/logic/Result";
import { LoginWithSocialNetwork } from "./loginWithSocialNetwork";
import { LoginWithSocialMediaDto } from "./loginWithSocialMediaDto";
import { LoginWithEmailErrors } from "./loginWithEmailErrors";
import * as cookie from "cookie";

export class LoginWithSocialMediaController extends BaseController {
    private useCase: LoginWithSocialNetwork;

    constructor(useCase: LoginWithSocialNetwork) {
        super();
        this.useCase = useCase;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: LoginWithSocialMediaDto = {
                idToken: this.req.params.token,
                email: this.req.body.email || "",
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

            this.res.setHeader(
                "Set-Cookie",
                cookie.serialize("auth", result.value.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "Development",
                    path: "/",
                })
            );
            return this.ok(this.res, result.value);
        } catch (err) {
            return this.fail(err);
        }
    }
}
