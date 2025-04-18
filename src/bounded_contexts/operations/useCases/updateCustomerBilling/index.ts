import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { UpdateCustomerBilling } from "./updateCustomerBilling";
import { UpdateCustomerBillingController } from "./updateCustomerBillingController";

export const updateCustomerBilling: UpdateCustomerBilling = new UpdateCustomerBilling(
    mongooseCustomerRepository,
    v3S3Service,
    mongooseLogRepository
);
export const updateCustomerBillingController = new UpdateCustomerBillingController(updateCustomerBilling);
