import { scheduleJob } from "node-schedule";
import { INotificationService } from "../../../../shared/notificationService/INotificationService";
import { PayAllSubscriptions } from "../../services/payAllSubscriptions/payAllSubscriptions";

export class BillingJob {
    private _payAllSubscriptions: PayAllSubscriptions;
    private _notificationService: INotificationService;

    constructor(payAllSubscriptions: PayAllSubscriptions, notificationService: INotificationService) {
        this._payAllSubscriptions = payAllSubscriptions;
        this._notificationService = notificationService;
    }

    public async initialize(): Promise<void> {
        try {
            scheduleJob("billing_job", "0 2 * * SAT", async () => {
                await this.payAllSubscriptions.execute({ executionDate: new Date() });
            });
        } catch (error: any) {
            this.notificationService.sendErrorEmail(error.message, "Billing job", "");
        }
    }

    /**
     * Getter payAllSubscriptions
     * @return {PayAllSubscriptions}
     */
    public get payAllSubscriptions(): PayAllSubscriptions {
        return this._payAllSubscriptions;
    }

    /**
     * Getter notificationService
     * @return {INotificationService}
     */
    public get notificationService(): INotificationService {
        return this._notificationService;
    }
}
