import { BaseController } from "../../../../core/infra/BaseController";
import { CheckIfEmailExists } from "./checkIfEmailExists";
import { CheckIfEmailExistsDto } from "./checkIfEmailExistsDto";

export class CheckIfEmailExistsController extends BaseController {
    private _checkIfEmailExists: CheckIfEmailExists;

    constructor(checkIfEmailExists: CheckIfEmailExists) {
        super();
        this._checkIfEmailExists = checkIfEmailExists;
    }

    async executeImpl(): Promise<any> {
        try {
            const dto: CheckIfEmailExistsDto = {
                email: this.req.body.email,
            };

            if (!!!dto.email) return this.fail("No ingresó ningún correo electrónico");

            const exists = await this.checkIfEmailExists.execute(dto);

            if (!exists) return this.fail(`No existe ningún cliente con el correo ${dto.email}`);
            return this.ok(this.res, exists);
        } catch (err) {
            return this.fail(err);
        }
    }

    /**
     * Getter checkIfEmailExists
     * @return {CheckIfEmailExists}
     */
    public get checkIfEmailExists(): CheckIfEmailExists {
        return this._checkIfEmailExists;
    }
}
