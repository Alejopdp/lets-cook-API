import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportNextOrdersWithRecipesSelection } from "./exportNextOrdersWithRecipesSelection";
import { ExportNextOrdersWithRecipesSelectionDto } from "./exportNextOrdersWithRecipesSelectionDto";

export class ExportNextOrdersWithRecipesSelectionController extends BaseController {
    private _exportNextOrdersWithRecipesSelection: ExportNextOrdersWithRecipesSelection;

    constructor(exportNextOrdersWithRecipesSelection: ExportNextOrdersWithRecipesSelection) {
        super();
        this._exportNextOrdersWithRecipesSelection = exportNextOrdersWithRecipesSelection;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ExportNextOrdersWithRecipesSelectionDto = {
                weeks: this.req.body.weeks || [],
                shippingDates: Array.isArray(this.req.body.shippingDates)
                    ? this.req.body.shippingDates.map((dateString: string) => new Date(dateString))
                    : [],
                billingDates: Array.isArray(this.req.body.billingDates)
                    ? this.req.body.billingDates.map((dateString: string) => new Date(dateString))
                    : [],
                customers: this.req.body.customers || [],
            };

            await this.exportNextOrdersWithRecipesSelection.execute(dto);

            return this.res.download("Selección de recetas.xlsx", (err) => fs.unlinkSync("Selección de recetas.xlsx"));
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter exportNextOrdersWithRecipesSelection
     * @return {ExportNextOrdersWithRecipesSelection}
     */
    public get exportNextOrdersWithRecipesSelection(): ExportNextOrdersWithRecipesSelection {
        return this._exportNextOrdersWithRecipesSelection;
    }
}
