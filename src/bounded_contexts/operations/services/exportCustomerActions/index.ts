import { xlsxService } from "../../application/exportService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { ExportCustomerActions } from "./exportCustomerActions";
import { ExportCustomerActionsController } from "./exportCustomersActionsController";

export const exportCustomerActions: ExportCustomerActions = new ExportCustomerActions(
    mongooseCustomerRepository,
    xlsxService,
    mongooseLogRepository
);
export const exportCustomerActionsController: ExportCustomerActionsController = new ExportCustomerActionsController(exportCustomerActions);
