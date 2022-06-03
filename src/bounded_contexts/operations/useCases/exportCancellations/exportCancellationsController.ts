import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportCancellations } from "./exportCancellations";
import { ExportCancellationsDto } from "./exportCancellationsDto";

export class ExportCancellationsController extends BaseController {
    private _exportCancellations: ExportCancellations;

    constructor(exportCancellations: ExportCancellations) {
        super();
        this._exportCancellations = exportCancellations;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ExportCancellationsDto = {};

            await this.exportCancellations.execute(dto);

            return this.res.download("Cancelaciones.xlsx", (err) => fs.unlinkSync("Cancelaciones.xlsx"));
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter exportCancellations
     * @return {ExportCancellations}
     */
    public get exportCancellations(): ExportCancellations {
        return this._exportCancellations;
    }
}
