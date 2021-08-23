import { xlsxService } from "../../application/exportService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { ExportCustomers } from "./exportCustomers";
import { ExportCustomersController } from "./exportCustomersController";

export const exportCustomers: ExportCustomers = new ExportCustomers(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    xlsxService
);
export const exportCustomersController: ExportCustomersController = new ExportCustomersController(exportCustomers);
