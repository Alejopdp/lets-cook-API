import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetCustomerInformationAsAdmin } from "./getCustomerInformationAsAdmin";
import { GetCustomerInformationAsAdminDto } from "./getCustomerInformationAsAdminDto";
import { GetCustomerInformationAsAdminPresenter } from "./getCustomerInformationAsAdminPresenter";

export class GetCustomerInformationAsAdminController extends BaseController {
    private _getCustomeInformationAsAdmind: GetCustomerInformationAsAdmin;
    private _getCustomeInformationAsAdmindPresenter: GetCustomerInformationAsAdminPresenter;

    constructor(
        getCustomerInformationAsAdmin: GetCustomerInformationAsAdmin,
        getCustomerInformationAsAdminPresenter: GetCustomerInformationAsAdminPresenter
    ) {
        super();
        this._getCustomeInformationAsAdmind = getCustomerInformationAsAdmin;
        this._getCustomeInformationAsAdmindPresenter = getCustomerInformationAsAdminPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetCustomerInformationAsAdminDto = {
                customerId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getCustomerInformationAsAdmin.execute(dto);
            const presented = this.getCustomerInformationAsAdminPresenter.present({ ...result, locale: dto.locale });

            return this.ok(this.res, presented);
        } catch (error: any) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter GetCustomerInformationAsAdmin
     * @return {GetCustomerInformationAsAdmin}
     */
    public get getCustomerInformationAsAdmin(): GetCustomerInformationAsAdmin {
        return this._getCustomeInformationAsAdmind;
    }

    /**
     * Getter getCustomerInformationAsAdminPresenter
     * @return {GetCustomerInformationAsAdminPresenter}
     */
    public get getCustomerInformationAsAdminPresenter(): GetCustomerInformationAsAdminPresenter {
        return this._getCustomeInformationAsAdmindPresenter;
    }
}
