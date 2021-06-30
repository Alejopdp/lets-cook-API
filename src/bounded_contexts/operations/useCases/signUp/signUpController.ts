import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { SignUpDto } from "./signUpDto";
import fs from "fs";
import { SignUp } from "./signUp";
import { logger } from "../../../../../config";
import { CustomerSignUpPresenter } from "./customerSignUpPresenter";
// import { kml } from '@mapbox/togeojson';
var tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

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
            };

            const result = await this.signUp.execute(dto);
            const presented = this.signUpPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error) {
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
