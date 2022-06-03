import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportAllCustomersActions } from "./exportAllCustomersActions";
import { ExportAllCustomersActionsDto } from "./exportAllCustomersActionsDto";

export class ExportAllCustomersActionsController extends BaseController {
    private _exportCustomers: ExportAllCustomersActions;

    constructor(exportCustomers: ExportAllCustomersActions) {
        super();
        this._exportCustomers = exportCustomers;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ExportAllCustomersActionsDto = {
                startDate: new Date(this.req.query.startDate as string),
                endDate: new Date(this.req.query.endDate as string),
            };

            await this.exportCustomers.execute(dto);

            return this.res.download("Acciones de clientes.xlsx", (err) => fs.unlinkSync("Acciones de clientes.xlsx"));
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter ExportAllCustomersActions
     * @return {ExportAllCustomersActions}
     */
    public get exportCustomers(): ExportAllCustomersActions {
        return this._exportCustomers;
    }
}
