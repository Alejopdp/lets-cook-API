import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPaymentOrdersAsAdmin } from "./getPaymentOrdersAsAdmin";
import { GetPaymentOrdersAsAdminDto } from "./getPaymentOrdersAsAdminDto";
import { GetPaymentOrdersAsAdminPresenter } from "./getPaymentOrdersAsAdminPresenter";

export class GetPaymentOrdersAsAdminController extends BaseController {
    private _getPaymentOrdesAsAdmin: GetPaymentOrdersAsAdmin;
    private _getPaymentOrdesAsAdminPresenter: GetPaymentOrdersAsAdminPresenter;

    constructor(getPaymentOrdesAsAdmin: GetPaymentOrdersAsAdmin, getPaymentOrdesAsAdminPresenter: GetPaymentOrdersAsAdminPresenter) {
        super();
        this._getPaymentOrdesAsAdmin = getPaymentOrdesAsAdmin;
        this._getPaymentOrdesAsAdminPresenter = getPaymentOrdesAsAdminPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPaymentOrdersAsAdminDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getPaymentOrdesAsAdmin.execute(dto);
            const presented = await this.getPaymentOrdesAsAdminPresenter.present(result.paymentOrders, result.customers);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter GetPaymentOrdesAsAdmin
     * @return {GetPaymentOrdesAsAdmin}
     */
    public get getPaymentOrdesAsAdmin(): GetPaymentOrdersAsAdmin {
        return this._getPaymentOrdesAsAdmin;
    }

    /**
     * Getter getPaymentOrdesAsAdminPresenter
     * @return {GetPaymentOrdesAsAdminPresenter}
     */
    public get getPaymentOrdesAsAdminPresenter(): GetPaymentOrdersAsAdminPresenter {
        return this._getPaymentOrdesAsAdminPresenter;
    }
}
