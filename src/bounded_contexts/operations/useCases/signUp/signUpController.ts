import { BaseController } from "../../../../core/infra/BaseController";
import { SignUpDto } from "./signUpDto";
import { SignUp } from "./signUp";
import { CustomerSignUpPresenter } from "./customerSignUpPresenter";

export class SignUpController extends BaseController {
    private _signUp: SignUp;
    private _signUpPresenter: CustomerSignUpPresenter;

    constructor(signUp: SignUp, signUpPresenter: CustomerSignUpPresenter) {
        super();
        this._signUp = signUp;
        this._signUpPresenter = signUpPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: SignUpDto = {
                email: this.req.body.email,
                isEmailVerified: false,
                password: this.req.body.password,
                state: "active",
                isInCheckout: !!this.req.body.isInCheckout,
            };

            const result = await this.signUp.execute(dto);
            const presented = this.signUpPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter signUp
     * @return {SignUp}
     */
    public get signUp(): SignUp {
        return this._signUp;
    }

    /**
     * Getter signUpPresenter
     * @return {CustomerSignUpPresenter}
     */
    public get signUpPresenter(): CustomerSignUpPresenter {
        return this._signUpPresenter;
    }
}
