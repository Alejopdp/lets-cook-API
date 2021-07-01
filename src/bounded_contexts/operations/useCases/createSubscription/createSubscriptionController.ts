import { BaseController } from "../../../../core/infra/BaseController";
import { CreateSubscription } from "./createSubscription";
import { CreateSubscriptionDto } from "./createSubscriptionDto";
import { CreateSubscriptionPresenter } from "./createSubscriptionPresenter";

export class CreateSubscriptionController extends BaseController {
    private _createSubscription: CreateSubscription;
    private _createSubscriptionPresenter: CreateSubscriptionPresenter;

    constructor(createSubscription: CreateSubscription, createSubscriptionPresenter: CreateSubscriptionPresenter) {
        super();
        this._createSubscription = createSubscription;
        this._createSubscriptionPresenter = createSubscriptionPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CreateSubscriptionDto = {
                customerId: this.req.body.customerId,
                planFrequency: this.req.body.planFrequency,
                planId: this.req.body.planId,
                planVariantId: this.req.body.planVariantId,
                restrictionComment: this.req.body.restrictionComment,
                couponId: this.req.body.couponId,
                stripePaymentMethodId: this.req.body.stripePaymentMethodId,
            };

            const result = await this.createSubscription.execute(dto);
            const presented = this.createSubscriptionPresenter.present(result.subscription, result.paymentIntent);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter createSubscription
     * @return {CreateSubscription}
     */
    public get createSubscription(): CreateSubscription {
        return this._createSubscription;
    }

    /**
     * Getter createSubscriptionPresenter
     * @return {CreateSubscriptionPresenter}
     */
    public get createSubscriptionPresenter(): CreateSubscriptionPresenter {
        return this._createSubscriptionPresenter;
    }
}
