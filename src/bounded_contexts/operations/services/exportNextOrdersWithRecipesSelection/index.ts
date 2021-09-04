import { xlsxService } from "../../application/exportService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { ExportNextOrdersWithRecipesSelection } from "./exportNextOrdersWithRecipesSelection";
import { ExportNextOrdersWithRecipesSelectionController } from "./exportNextOrdersWithRecipesSelectionController";

export const exportNextOrdersWithRecipesSelection: ExportNextOrdersWithRecipesSelection = new ExportNextOrdersWithRecipesSelection(
    mongooseOrderRepository,
    mongooseWeekRepository,
    mongooseSubscriptionRepository,
    xlsxService,
    mongooseShippingZoneRepository
);

export const exportNextOrdersWithRecipesSelectionController: ExportNextOrdersWithRecipesSelectionController =
    new ExportNextOrdersWithRecipesSelectionController(exportNextOrdersWithRecipesSelection);
