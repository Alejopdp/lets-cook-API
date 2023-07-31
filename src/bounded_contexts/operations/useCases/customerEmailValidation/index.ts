import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository, } from "../../infra/repositories/customer";
import { CustomerEmailValidation } from "./customerEmailValidation";
import { CustomerEmailValidationController } from "./customerEmailValidationController";

export const emailValidated: CustomerEmailValidation = new CustomerEmailValidation(mongooseCustomerRepository, v3S3Service);
export const emailValidatedController: CustomerEmailValidationController = new CustomerEmailValidationController(emailValidated);
