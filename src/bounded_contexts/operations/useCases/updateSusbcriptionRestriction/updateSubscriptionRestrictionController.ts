import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateSubscriptionRestriction } from "./updateSubscriptionRestriction";
import { UpdateSubscriptionRestrictionDto } from "./updateSubscriptionRestrictionDto";
import fs from "fs";

export class UpdateSubscriptionRestrictionController extends BaseController {
    private _updateSubscriptionRestriction: UpdateSubscriptionRestriction;

    constructor(updateSubscriptionRestriction: UpdateSubscriptionRestriction) {
        super();
        this._updateSubscriptionRestriction = updateSubscriptionRestriction;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateSubscriptionRestrictionDto = {
                locale: this.req.body.locale,
                restrictionId: this.req.body.restrictionId,
                subscriptionId: this.req.params.id,
                comment: this.req.body.comment,
                //@ts-ignore
                nameOrEmailOfAdminExecutingRequest: this.req.currentUser?.role ? this.req.currentUser.getFullName() : undefined,
            };

            await this.updateSubscriptionRestriction.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter UpdateSubscriptionRestriction
     * @return {UpdateSubscriptionRestriction}
     */
    public get updateSubscriptionRestriction(): UpdateSubscriptionRestriction {
        return this._updateSubscriptionRestriction;
    }
}
