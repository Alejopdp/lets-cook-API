import { BaseController } from "../../../../core/infra/BaseController";
import { GetAnalytics } from "./getAnalytics";
import { GetAnalyticsDto } from "./getAnalyticsDto";

export class GetAnalyticsController extends BaseController {
    private _getAnalytics: GetAnalytics;

    constructor(getAnalytics: GetAnalytics) {
        super();
        this._getAnalytics = getAnalytics;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetAnalyticsDto = {};
            const result = await this.getAnalytics.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter getAnalytics
     * @return {GetAnalytics}
     */
    public get getAnalytics(): GetAnalytics {
        return this._getAnalytics;
    }
}
