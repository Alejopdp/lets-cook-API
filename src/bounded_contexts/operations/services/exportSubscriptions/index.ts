import { xlsxService } from "../../application/exportService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { ExportSubscriptions } from "./exportSubscriptions";
import { ExportSubscriptionsController } from "./exportSubscriptionsController";

export const exportSubscriptions: ExportSubscriptions = new ExportSubscriptions(
    mongooseShippingZoneRepository,
    mongooseSubscriptionRepository,
    xlsxService
);
export const exportSubscriptionsController: ExportSubscriptionsController = new ExportSubscriptionsController(exportSubscriptions);
