import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportCustomers } from "./exportCustomers";

export class ExportCustomersController extends BaseController {
    private _exportCustomers: ExportCustomers;

    constructor(exportCustomers: ExportCustomers) {
        super();
        this._exportCustomers = exportCustomers;
    }

    protected async executeImpl(): Promise<any> {
        try {
            await this.exportCustomers.execute();

            return this.res.download("Clientes.xlsx", (err) => fs.unlinkSync("Clientes.xlsx"));
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter ExportCustomers
     * @return {ExportCustomers}
     */
    public get exportCustomers(): ExportCustomers {
        return this._exportCustomers;
    }
}
