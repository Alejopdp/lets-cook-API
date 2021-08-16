import schedule from "node-schedule";
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
        // schedule.scheduleJob("Billing job", "0 2 * * SAT", () => {
        try {
            schedule.scheduleJob("Billing job", "* * * * *", async () => {
                await this.payAllSubscriptions.execute();
            });
        } catch (error) {
            this.notificationService.sendErrorEmail(error.message);
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
