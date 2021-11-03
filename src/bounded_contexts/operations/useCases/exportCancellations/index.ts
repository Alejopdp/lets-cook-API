import { xlsxService } from "../../application/exportService";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { ExportCancellations } from "./exportCancellations";
import { ExportCancellationsController } from "./exportCancellationsController";

export const exportCancellations: ExportCancellations = new ExportCancellations(mongooseSubscriptionRepository, xlsxService);
export const exportCancellationsController: ExportCancellationsController = new ExportCancellationsController(exportCancellations);
