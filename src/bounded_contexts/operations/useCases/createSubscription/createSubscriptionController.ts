import { BaseController } from "../../../../core/infra/BaseController";
import { CreateSubscription } from "./createSubscription";
import { CreateSubscriptionDto } from "./createSubscriptionDto";

export class CreateSubscriptionController extends BaseController {
    private _createSubscription: CreateSubscription;

    constructor(createSubscription: CreateSubscription) {
        super();
        this._createSubscription = createSubscription;
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
            };

            await this.createSubscription.execute(dto);

            return this.ok(this.res);
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
}
