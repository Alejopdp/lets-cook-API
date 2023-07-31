import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdateCustomer } from "./updateCustomer";
import { UpdateCustomerController } from "./updateCustomerController";

export const updateCustomer: UpdateCustomer = new UpdateCustomer(mongooseCustomerRepository, v3S3Service);
export const updateCustomerController = new UpdateCustomerController(updateCustomer);
