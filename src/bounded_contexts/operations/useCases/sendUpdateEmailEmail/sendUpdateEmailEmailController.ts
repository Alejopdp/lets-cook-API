import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { SendUpdateEmailEmail } from "./sendUpdateEmailEmail";
import { SendUpdateEmailEmailDto } from "./sendUpdateEmailEmailDto";

export class SendNewSubscriptionEmailController extends BaseController {
    private _sendUpdateEmailEmail: SendUpdateEmailEmail;

    constructor(sendUpdateEmailEmail: SendUpdateEmailEmail) {
        super();
        this._sendUpdateEmailEmail = sendUpdateEmailEmail;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: SendUpdateEmailEmailDto = {
                customerId: this.req.params.customerId,
                newEmail: this.req.body.email,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            await this.sendUpdateEmailEmail.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter SendUpdateEmailEmail
     * @return {SendUpdateEmailEmail}
     */
    public get sendUpdateEmailEmail(): SendUpdateEmailEmail {
        return this._sendUpdateEmailEmail;
    }
}
