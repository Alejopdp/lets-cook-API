import { xlsxService } from "../../application/exportService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { ExportAllCustomersActions } from "./exportAllCustomersActions";
import { ExportAllCustomersActionsController } from "./exportAllCustomersActionsController";

export const exportAllCustomersActions: ExportAllCustomersActions = new ExportAllCustomersActions(
    mongooseCustomerRepository,
    xlsxService,
    mongooseLogRepository
);
export const exportAllCustomersActionsController: ExportAllCustomersActionsController = new ExportAllCustomersActionsController(
    exportAllCustomersActions
);
