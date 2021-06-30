import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { SignUpDto } from "./signUpDto";
import fs from "fs";
import { SignUp } from "./signUp";
import { logger } from "../../../../../config";
// import { kml } from '@mapbox/togeojson';
var tj = require("@mapbox/togeojson");
const DOMParser = require("xmldom").DOMParser;

export class SignUpController extends BaseController {
    private _signUp: SignUp;

    constructor(signUp: SignUp) {
        super();
        this._signUp = signUp;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: SignUpDto = {
                email: this.req.body.email,
                isEmailVerified: false,
                password: this.req.body.password,
                state: "active",
            };

            await this.signUp.execute(dto);

            // fs.unlinkSync(planImagePath);

            return this.ok(this.res);
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
}
