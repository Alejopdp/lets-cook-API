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
            const dto: ExportAllCustomersActionsDto = {};

            await this.exportCustomers.execute(dto);

            return this.res.download("Acciones de clientes.xlsx", (err) => fs.unlinkSync("Acciones de clientes.xlsx"));
        } catch (error) {
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
