import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportCoupons } from "./exportCoupons";
import { ExportCouponsDto } from "./exportCouponsDto";

export class ExportCouponsController extends BaseController {
    private _exportCoupons: ExportCoupons;

    constructor(exportCoupons: ExportCoupons) {
        super();
        this._exportCoupons = exportCoupons;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ExportCouponsDto = {};

            await this.exportCoupons.execute(dto);

            return this.res.download("Cupones.xlsx", (err) => fs.unlinkSync("Cupones.xlsx"));
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter exportCoupons
     * @return {ExportCoupons}
     */
    public get exportCoupons(): ExportCoupons {
        return this._exportCoupons;
    }
}
