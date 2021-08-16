import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { SendNewSubscriptionEmail } from "./sendNewSubscriptionEmail";
import { SendNewSubscriptionEmailDto } from "./sendNewSubscriptionEmailDto";

export class SendNewSubscriptionEmailController extends BaseController {
    private _sendNewSubscriptionEmail: SendNewSubscriptionEmail;

    constructor(sendNewSubscriptionEmail: SendNewSubscriptionEmail) {
        super();
        this._sendNewSubscriptionEmail = sendNewSubscriptionEmail;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: SendNewSubscriptionEmailDto = {
                subscriptionId: this.req.params.subscriptionId,
                // locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            await this.sendNewSubscriptionEmail.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter SendNewSubscriptionEmail
     * @return {SendNewSubscriptionEmail}
     */
    public get sendNewSubscriptionEmail(): SendNewSubscriptionEmail {
        return this._sendNewSubscriptionEmail;
    }
}
