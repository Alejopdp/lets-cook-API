import { BaseController } from "../../../../core/infra/BaseController";
import { FuturePaymentSetup } from "./futurePaymentSetup";
import { FuturePaymentSetupDto } from "./futurePaymentSetupDto";

export class FuturePaymentSetupController extends BaseController {
    private _futurePaymentSetup: FuturePaymentSetup;

    constructor(futurePaymentSetup: FuturePaymentSetup) {
        super();
        this._futurePaymentSetup = futurePaymentSetup;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: FuturePaymentSetupDto = {
                customerId: this.req.params.id,
            };

            const result = await this.futurePaymentSetup.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error as string | Error);
        }
    }

    /**
     * Getter futurePaymentSetup
     * @return {FuturePaymentSetup}
     */
    public get futurePaymentSetup(): FuturePaymentSetup {
        return this._futurePaymentSetup;
    }
}
