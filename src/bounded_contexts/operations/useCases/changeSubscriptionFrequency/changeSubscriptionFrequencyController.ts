import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { ChangeSubscriptionFrequency } from "./changeSubscriptionFrequency";
import { ChangeSubscriptionFrequencyDto } from "./changeSubscriptionFrequencyDto";

export class ChangeSubscriptionFrequencyController extends BaseController {
    private _changeSubscriptionFrequency: ChangeSubscriptionFrequency;

    constructor(changeSubscriptionFrequency: ChangeSubscriptionFrequency) {
        super();
        this._changeSubscriptionFrequency = changeSubscriptionFrequency;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ChangeSubscriptionFrequencyDto = {
                frequency: this.req.body.frequency,
                locale: (<any>Locale)[(this.req.query.locale as string) ?? "es"],
                subscriptionId: this.req.params.id,
            };

            await this.changeSubscriptionFrequency.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter changeSubscriptionFrequency
     * @return {ChangeSubscriptionFrequency}
     */
    public get changeSubscriptionFrequency(): ChangeSubscriptionFrequency {
        return this._changeSubscriptionFrequency;
    }
}
