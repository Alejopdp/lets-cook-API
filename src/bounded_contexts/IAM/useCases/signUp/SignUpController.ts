import { BaseController } from "../../../../core/infra/BaseController";
import { SignUp } from "./SignUp";
import { SignUpDTO } from "./SignUpDTO";
import { CreateUserErrors } from "./SignUpErrors";

export class SignUpController extends BaseController {
  private useCase: SignUp;

  constructor(useCase: SignUp) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const dto: SignUpDTO = this.req.body as SignUpDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.AccountAlreadyExists:
            return this.conflict(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.ok(this.res);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
