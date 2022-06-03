import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportSubscriptions } from "./exportSubscriptions";

export class ExportSubscriptionsController extends BaseController {
    private _exportSubscriptions: ExportSubscriptions;

    constructor(exportSubscriptions: ExportSubscriptions) {
        super();
        this._exportSubscriptions = exportSubscriptions;
    }

    protected async executeImpl(): Promise<any> {
        try {
            await this.exportSubscriptions.execute();

            return this.res.download("Suscripciones.xlsx", (err) => fs.unlinkSync("Suscripciones.xlsx"));
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter ExportSubscriptions
     * @return {ExportSubscriptions}
     */
    public get exportSubscriptions(): ExportSubscriptions {
        return this._exportSubscriptions;
    }
}
