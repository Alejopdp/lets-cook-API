import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { CreateCustomerByAdmin } from "./createCustomerByAdmin";
import { CreateCustomerByAdminController } from "./createCustomerByAdminController";

export const createCustomerByAdmin: CreateCustomerByAdmin = new CreateCustomerByAdmin(mongooseCustomerRepository, v3S3Service);
export const createCustomerByAdminController: CreateCustomerByAdminController = new CreateCustomerByAdminController(createCustomerByAdmin);
