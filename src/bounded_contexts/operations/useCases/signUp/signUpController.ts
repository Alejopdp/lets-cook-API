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
            // if (!this.req.file) throw new Error("No ha ingresado un archivo kml");
            // const shippingZoneKmlPath = this.req.file.path;
            // // const shippingZoneFile = thi
            // var kml = new DOMParser().parseFromString(fs.readFileSync(shippingZoneKmlPath, "utf8"));
            // var converted = tj.kml(kml);

            // let polygonFilter = [],
            //     coordinates = [];
            // if (converted.features && converted.features.length > 0) {
            //     polygonFilter = converted.features.filter((val: any) => val.properties.name === this.req.body.reference);
            // }

            // logger.warn(``);
            // if (polygonFilter.length > 1) throw new Error("No debe haber más de un polígono con el mismo nombre");
            // if (polygonFilter.length === 0) throw new Error("No existen zonas de envio");
            // if (polygonFilter.length === 1) coordinates = converted.features[0].geometry.coordinates[0];

            const dto: SignUpDto = {
                email: this.req.body.email,
                isEmailVerified: false,
                password: this.req.body.password,
                state: "active"
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
