import { xlsxService } from "../../application/exportService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { ExportCancellations } from "./exportCancellations";
import { ExportCancellationsController } from "./exportCancellationsController";

export const exportCancellations: ExportCancellations = new ExportCancellations(
    mongooseSubscriptionRepository,
    xlsxService,
    mongooseOrderRepository
);
export const exportCancellationsController: ExportCancellationsController = new ExportCancellationsController(exportCancellations);
