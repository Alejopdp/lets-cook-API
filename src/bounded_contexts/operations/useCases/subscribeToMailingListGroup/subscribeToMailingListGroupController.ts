import { BaseController } from "../../../../core/infra/BaseController";
import { SubscribeToMailingListGroup } from "./subscribeToMailingListGroup";
import { SubscribeToMailingListGroupDto } from "./subscribeToMailingListGroupDto";

export class SubscribeToMailingListGroupController extends BaseController {
    private _SubscribeToMailingListGroup: SubscribeToMailingListGroup;

    constructor(SubscribeToMailingListGroup: SubscribeToMailingListGroup) {
        super();
        this._SubscribeToMailingListGroup = SubscribeToMailingListGroup;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: SubscribeToMailingListGroupDto = {
                groupId: this.req.params.groupId,
                email: this.req.body.email,
                planName: this.req.body.planName,
                planVariantLabel: this.req.body.planVariantLabel,
            };

            await this.SubscribeToMailingListGroup.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            console.log(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {SubscribeToMailingListGroup}
     */
    public get SubscribeToMailingListGroup(): SubscribeToMailingListGroup {
        return this._SubscribeToMailingListGroup;
    }
}
