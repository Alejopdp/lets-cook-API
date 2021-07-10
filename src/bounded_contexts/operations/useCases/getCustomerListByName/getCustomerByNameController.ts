import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCustomerByName } from "./getCustomerByName";
import { GetCustomerByNameDto } from "./getCustomerByNameDto";

export class GetCustomerByNameController extends BaseController {
    private _getCustomerByName: GetCustomerByName;

    constructor(getCustomerByName: GetCustomerByName) {
        super();
        this._getCustomerByName = getCustomerByName;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCustomerByNameDto = {
                name: this.req.params.name,
            };
            const result = await this.getCustomerByName.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getCustomerList
     * @return {GetCustomerByName}
     */
    public get getCustomerByName(): GetCustomerByName {
        return this._getCustomerByName;
    }
}
