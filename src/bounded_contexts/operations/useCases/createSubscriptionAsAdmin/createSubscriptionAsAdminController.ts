import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { CreateSubscriptionAsAdmin } from "./createSubscriptionAsAdmin";
import { CreateSubscriptionAsAdminDto } from "./createSubscriptionAsAdminDto";
import { CreateSubscriptionAsAdminPresenter } from "./createSubscriptionAsAdminPresenter";

export class CreateSubscriptionAsAdminController extends BaseController {
    private _createSubscriptionAsAdmin: CreateSubscriptionAsAdmin;
    private _createSubscriptionAsAdminPresenter: CreateSubscriptionAsAdminPresenter;

    constructor(
        createSubscriptionAsAdmin: CreateSubscriptionAsAdmin,
        createSubscriptionAsAdminPresenter: CreateSubscriptionAsAdminPresenter
    ) {
        super();
        this._createSubscriptionAsAdmin = createSubscriptionAsAdmin;
        this._createSubscriptionAsAdminPresenter = createSubscriptionAsAdminPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CreateSubscriptionAsAdminDto = {
                customerId: this.req.body.customerId,
                planFrequency: this.req.body.planFrequency,
                planId: this.req.body.planId,
                planVariantId: this.req.body.planVariantId,
                couponCode: this.req.body.couponCode,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                purchaseDate: new Date(),
                useWalletAsPaymentMethod: this.req.body.useWalletAsPaymentMethod
            };

            const result = await this.createSubscriptionAsAdmin.execute(dto);

            return this.ok(this.res, { subscriptionId: result.subscription.id.value });
            // return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter createSubscriptionAsAdmin
     * @return {CreateSubscriptionAsAdmin}
     */
    public get createSubscriptionAsAdmin(): CreateSubscriptionAsAdmin {
        return this._createSubscriptionAsAdmin;
    }

    /**
     * Getter createSubscriptionAsAdminPresenter
     * @return {CreateSubscriptionAsAdminPresenter}
     */
    public get createSubscriptionAsAdminPresenter(): CreateSubscriptionAsAdminPresenter {
        return this._createSubscriptionAsAdminPresenter;
    }
}
