import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateMailingListSubscriber } from "./updateMailingListSubscriber";
import { UpdateMailingListSubscriberDto } from "./updateMailingListSubscriberDto";

export class UpdateMailingListSubscriberController extends BaseController {
    private _UpdateMailingListSubscriber: UpdateMailingListSubscriber;

    constructor(UpdateMailingListSubscriber: UpdateMailingListSubscriber) {
        super();
        this._UpdateMailingListSubscriber = UpdateMailingListSubscriber;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateMailingListSubscriberDto = {
                data: this.req.body.data,
                email: this.req.params.subscriberEmail,
            };

            await this.UpdateMailingListSubscriber.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            console.log(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {UpdateMailingListSubscriber}
     */
    public get UpdateMailingListSubscriber(): UpdateMailingListSubscriber {
        return this._UpdateMailingListSubscriber;
    }
}
