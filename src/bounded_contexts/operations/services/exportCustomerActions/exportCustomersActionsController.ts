import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportCustomerActions } from "./exportCustomerActions";
import { ExportCustomerActionsDto } from "./exportCustomerActionsDto";

export class ExportCustomerActionsController extends BaseController {
    private _exportCustomers: ExportCustomerActions;

    constructor(exportCustomers: ExportCustomerActions) {
        super();
        this._exportCustomers = exportCustomers;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ExportCustomerActionsDto = {
                customerId: this.req.params.customerId,
                startDate: new Date(this.req.query.startDate as string),
                endDate: new Date(this.req.query.endDate as string),
            };

            await this.exportCustomers.execute(dto);

            return this.res.download("Acciones de cliente.xlsx", (err) => fs.unlinkSync("Acciones de cliente.xlsx"));
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter ExportCustomerActions
     * @return {ExportCustomerActions}
     */
    public get exportCustomers(): ExportCustomerActions {
        return this._exportCustomers;
    }
}
