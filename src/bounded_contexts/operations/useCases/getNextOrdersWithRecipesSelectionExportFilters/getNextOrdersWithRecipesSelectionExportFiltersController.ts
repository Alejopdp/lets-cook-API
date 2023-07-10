import { BaseController } from "../../../../core/infra/BaseController";
import { GetNextOrdersWithRecipesSelectionExportFilters } from "./getNextOrdersWithRecipesSelectionExportFilters";
import { GetNextOrdersWithRecipesSelectionExportFiltersDto } from "./getNextOrdersWithRecipesSelectionExportFiltersDto";
import { GetNextOrdersWithRecipesSelectionExportFiltersPresenter } from "./getNextOrdersWithRecipesSelectionExportFiltersPresenter";

export class GetNextOrdersWithRecipesSelectionExportFiltersController extends BaseController {
    private _getNextOrdersWithRecipesSelectionExportFilters: GetNextOrdersWithRecipesSelectionExportFilters;
    private _getNextOrdersWithRecipesSelectionExportFiltersPresenter: GetNextOrdersWithRecipesSelectionExportFiltersPresenter;

    constructor(
        getNextOrdersWithRecipesSelectionExportFilters: GetNextOrdersWithRecipesSelectionExportFilters,
        getNextOrdersWithRecipesSelectionExportFiltersPresenter: GetNextOrdersWithRecipesSelectionExportFiltersPresenter
    ) {
        super();
        this._getNextOrdersWithRecipesSelectionExportFilters = getNextOrdersWithRecipesSelectionExportFilters;
        this._getNextOrdersWithRecipesSelectionExportFiltersPresenter = getNextOrdersWithRecipesSelectionExportFiltersPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetNextOrdersWithRecipesSelectionExportFiltersDto = {};

            const result = await this.getNextOrdersWithRecipesSelectionExportFilters.execute(dto);
            const presented = this.getNextOrdersWithRecipesSelectionExportFiltersPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetNextOrdersWithRecipesSelectionExportFilters}
     */
    public get getNextOrdersWithRecipesSelectionExportFilters(): GetNextOrdersWithRecipesSelectionExportFilters {
        return this._getNextOrdersWithRecipesSelectionExportFilters;
    }

    /**
     * Getter getNextOrdersWithRecipesSelectionExportFiltersPresenter
     * @return {GetNextOrdersWithRecipesSelectionExportFiltersPresenter}
     */
    public get getNextOrdersWithRecipesSelectionExportFiltersPresenter(): GetNextOrdersWithRecipesSelectionExportFiltersPresenter {
        return this._getNextOrdersWithRecipesSelectionExportFiltersPresenter;
    }
}
