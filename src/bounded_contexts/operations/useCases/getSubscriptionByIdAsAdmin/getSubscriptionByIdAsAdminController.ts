import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetSubscriptionByIdAsAdmin } from "./getSubscriptionByIdAsAdmin";
import { GetSubscriptionByIdAsAdminDto } from "./getSubscriptionByIdAsAdminDto";
import { GetSubscriptionByIdAsAdminPresenter } from "./getSubscriptionByIdAsAdminPresenter";

export class GetSubscriptionByIdAsAdminController extends BaseController {
    private _getSubscriptionByIdAsAdmin: GetSubscriptionByIdAsAdmin;
    private _getSubscriptionByIdAsAdminPresenter: GetSubscriptionByIdAsAdminPresenter;

    constructor(
        getSubscriptionByIdAsAdmin: GetSubscriptionByIdAsAdmin,
        getSubscriptionByIdAsAdminPresenter: GetSubscriptionByIdAsAdminPresenter
    ) {
        super();
        this._getSubscriptionByIdAsAdmin = getSubscriptionByIdAsAdmin;
        this._getSubscriptionByIdAsAdminPresenter = getSubscriptionByIdAsAdminPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetSubscriptionByIdAsAdminDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                subscriptionId: this.req.params.id,
            };
            const result = await this.getSubscriptionByIdAsAdmin.execute(dto);
            const presented = await this.getSubscriptionByIdAsAdminPresenterAsAdmin.present(
                result.subscription,
                result.orders,
                result.customer
            );

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetSubscriptionByIdAsAdmin}
     */
    public get getSubscriptionByIdAsAdmin(): GetSubscriptionByIdAsAdmin {
        return this._getSubscriptionByIdAsAdmin;
    }

    /**
     * Getter getSubscriptionByIdAsAdminPresenterAsAdmin
     * @return {GetSubscriptionByIdAsAdminPresenterAsAdmin}
     */
    public get getSubscriptionByIdAsAdminPresenterAsAdmin(): GetSubscriptionByIdAsAdminPresenter {
        return this._getSubscriptionByIdAsAdminPresenter;
    }
}
