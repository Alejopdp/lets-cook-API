import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportRecipeRatings } from "./exportRecipeRatings";

export class ExportRecipeRatingsController extends BaseController {
    private _exportRecipeRatings: ExportRecipeRatings;

    constructor(exportRecipeRatings: ExportRecipeRatings) {
        super();
        this._exportRecipeRatings = exportRecipeRatings;
    }

    protected async executeImpl(): Promise<any> {
        try {
            await this.exportCustomers.execute({ queryDate: new Date(), shippingDate: !this.req.query.shippingDate ? undefined : new Date(this.req.query.shippingDate as string) });

            return this.res.download("Valoración de recetas.xlsx", (err) => fs.unlinkSync("Valoración de recetas.xlsx"));
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter ExportRecipeRatings
     * @return {ExportRecipeRatings}
     */
    public get exportCustomers(): ExportRecipeRatings {
        return this._exportRecipeRatings;
    }
}
