import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetNextOrdersWithRecipesSelectionExportFilters } from "./getNextOrdersWithRecipesSelectionExportFilters";
import { GetNextOrdersWithRecipesSelectionExportFiltersController } from "./getNextOrdersWithRecipesSelectionExportFiltersController";
import { GetNextOrdersWithRecipesSelectionExportFiltersPresenter } from "./getNextOrdersWithRecipesSelectionExportFiltersPresenter";

export const getNextOrdersWithRecipesSelectionExportFilters: GetNextOrdersWithRecipesSelectionExportFilters =
    new GetNextOrdersWithRecipesSelectionExportFilters(mongooseWeekRepository);
export const getNextOrdersWithRecipesSelectionExportFiltersPresenter: GetNextOrdersWithRecipesSelectionExportFiltersPresenter =
    new GetNextOrdersWithRecipesSelectionExportFiltersPresenter();
export const getNextOrdersWithRecipesSelectionExportFiltersController: GetNextOrdersWithRecipesSelectionExportFiltersController =
    new GetNextOrdersWithRecipesSelectionExportFiltersController(
        getNextOrdersWithRecipesSelectionExportFilters,
        getNextOrdersWithRecipesSelectionExportFiltersPresenter
    );
