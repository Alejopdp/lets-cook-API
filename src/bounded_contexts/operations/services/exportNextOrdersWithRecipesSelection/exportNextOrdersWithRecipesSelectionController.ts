import { BaseController } from "../../../../core/infra/BaseController";
import fs from "fs";
import { ExportNextOrdersWithRecipesSelection } from "./exportNextOrdersWithRecipesSelection";

export class ExportNextOrdersWithRecipesSelectionController extends BaseController {
    private _exportNextOrdersWithRecipesSelection: ExportNextOrdersWithRecipesSelection;

    constructor(exportNextOrdersWithRecipesSelection: ExportNextOrdersWithRecipesSelection) {
        super();
        this._exportNextOrdersWithRecipesSelection = exportNextOrdersWithRecipesSelection;
    }

    protected async executeImpl(): Promise<any> {
        try {
            await this.exportNextOrdersWithRecipesSelection.execute();

            return this.res.download("Selección de recetas.xlsx", (err) => fs.unlinkSync("Selección de recetas.xlsx"));
        } catch (error) {
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
