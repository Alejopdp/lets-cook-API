import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdateCustomerBilling } from "./updateCustomerBilling";
import { UpdateCustomerBillingController } from "./updateCustomerBillingController";

export const updateCustomerBilling: UpdateCustomerBilling = new UpdateCustomerBilling(mongooseCustomerRepository, s3Service);
export const updateCustomerBillingController = new UpdateCustomerBillingController(updateCustomerBilling);
