import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetLogs } from "./getLogs";
import { GetLogsDto } from "./getLogsDto";
import { GetLogsPresenter } from "./getLogsPresenter";

export class GetLogsController extends BaseController {
    private _getLogs: GetLogs;
    private _getLogsPresenter: GetLogsPresenter;

    constructor(getLogs: GetLogs, getLogsPresenter: GetLogsPresenter) {
        super();
        this._getLogs = getLogs;
        this._getLogsPresenter = getLogsPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetLogsDto = {
                customerId: this.req.query.customerId as string,
            };

            const result = await this.getLogs.execute(dto);
            const presented = this.getLogsPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter GetLogs
     * @return {GetLogs}
     */
    public get getLogs(): GetLogs {
        return this._getLogs;
    }

    /**
     * Getter getLogsPresenter
     * @return {GetLogsPresenter}
     */
    public get getLogsPresenter(): GetLogsPresenter {
        return this._getLogsPresenter;
    }
}
