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
            const dto = {
                createdAt: this.req.query.createdAt ? new Date(this.req.query.createdAt as string) : undefined,
            }
            await this.exportCustomers.execute(dto);

            return this.res.download("Clientes.xlsx", (err) => fs.unlinkSync("Clientes.xlsx"));
        } catch (error: any) {
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
