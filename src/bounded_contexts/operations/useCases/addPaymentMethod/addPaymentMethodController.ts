import { BaseController } from "../../../../core/infra/BaseController";
import { AddPaymentMethod } from "./addPaymentMethod";
import { AddPaymentMethodDto } from "./addPaymentMethodDto";
import { AddPaymentMethodPresenter } from "./addPaymentMethodPresenter";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";

export class AddPaymentMethodController extends BaseController {
    private _addPaymentMethod: AddPaymentMethod;
    private _addPaymentMethodPresenter: AddPaymentMethodPresenter;

    constructor(addPaymentMethod: AddPaymentMethod, addPaymentMethodPresenter: AddPaymentMethodPresenter) {
        super();
        this._addPaymentMethod = addPaymentMethod;
        this._addPaymentMethodPresenter = addPaymentMethodPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: AddPaymentMethodDto = {
                customerId: this.req.params.id,
                stripeId: this.req.body.stripePaymentMethodId,
            };

            const paymentMethod: PaymentMethod = await this.addPaymentMethod.execute(dto);
            const presented = this.addPaymentMethodPresenter.present(paymentMethod);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter addPaymentMethodBilling
     * @return {AddPaymentMethod}
     */
    public get addPaymentMethod(): AddPaymentMethod {
        return this._addPaymentMethod;
    }

    /**
     * Getter addPaymentMethodPresenter
     * @return {AddPaymentMethodPresenter}
     */
    public get addPaymentMethodPresenter(): AddPaymentMethodPresenter {
        return this._addPaymentMethodPresenter;
    }
}
