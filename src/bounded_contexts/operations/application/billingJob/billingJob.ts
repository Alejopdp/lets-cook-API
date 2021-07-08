import schedule from "node-schedule";
import { PayAllSubscriptions } from "../../services/payAllSubscriptions/payAllSubscriptions";

export class BillingJob {
    private _payAllSubscriptions: PayAllSubscriptions;

    constructor(payAllSubscriptions: PayAllSubscriptions) {
        this._payAllSubscriptions = payAllSubscriptions;
    }

    public initialize(): void {
        schedule.scheduleJob("Billing job", "0 2 * * SAT", () => {
            this.payAllSubscriptions.execute();
        });
    }

    /**
     * Getter payAllSubscriptions
     * @return {PayAllSubscriptions}
     */
    public get payAllSubscriptions(): PayAllSubscriptions {
        return this._payAllSubscriptions;
    }
}
