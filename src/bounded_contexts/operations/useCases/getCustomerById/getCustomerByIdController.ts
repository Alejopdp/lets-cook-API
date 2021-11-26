import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCustomerById } from "./getCustomerById";
import { GetCustomerByIdDto } from "./getCustomerByIdDto";
import { GetCustomerByIdPresenter } from "./getCustomerByIdPresenter";

export class GetCustomerByIdController extends BaseController {
    private _getCustomerById: GetCustomerById;
    private _getCustomerByIdPresenter: GetCustomerByIdPresenter;

    constructor(getCustomerById: GetCustomerById, getCustomerByIdPresenter: GetCustomerByIdPresenter) {
        super();
        this._getCustomerById = getCustomerById;
        this._getCustomerByIdPresenter = getCustomerByIdPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCustomerByIdDto = {
                customerId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getCustomerById.execute(dto);
            const presented = this.getCustomerByIdPresenter.present(result, dto.locale);

            return this.ok(this.res, presented);
        } catch (error) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter GetCustomerById
     * @return {GetCustomerById}
     */
    public get getCustomerById(): GetCustomerById {
        return this._getCustomerById;
    }

    /**
     * Getter getCustomerByIdPresenter
     * @return {GetCustomerByIdPresenter}
     */
    public get getCustomerByIdPresenter(): GetCustomerByIdPresenter {
        return this._getCustomerByIdPresenter;
    }
}
