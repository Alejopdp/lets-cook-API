import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { CreateManySubscriptions } from "./createManySubscriptions";
import { CreateManySubscriptionsDto } from "./createManySubscriptionsDto";
import { CreateManySubscriptionsPresenter } from "./ccreateManySubscriptionsPresenter";

export class CreateManySubscriptionsController extends BaseController {
    private _createManySubscriptions: CreateManySubscriptions;
    private _createManySubscriptionsPresenter: CreateManySubscriptionsPresenter;

    constructor(createManySubscriptions: CreateManySubscriptions, createManySubscriptionsPresenter: CreateManySubscriptionsPresenter) {
        super();
        this._createManySubscriptions = createManySubscriptions;
        this._createManySubscriptionsPresenter = createManySubscriptionsPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CreateManySubscriptionsDto = {
                customerId: this.req.body.customerId,
                plans: this.req.body.plans,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.CreateManySubscriptions.execute(dto);
            const presented = this.CreateManySubscriptionsPresenter.present(
                result.subscriptions,
                result.paymentIntent,
                result.paymentOrder
            );

            return this.ok(this.res, presented);
            // return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter CreateManySubscriptions
     * @return {CreateManySubscriptions}
     */
    public get CreateManySubscriptions(): CreateManySubscriptions {
        return this._createManySubscriptions;
    }

    /**
     * Getter CreateManySubscriptionsPresenter
     * @return {CreateManySubscriptionsPresenter}
     */
    public get CreateManySubscriptionsPresenter(): CreateManySubscriptionsPresenter {
        return this._createManySubscriptionsPresenter;
    }
}
