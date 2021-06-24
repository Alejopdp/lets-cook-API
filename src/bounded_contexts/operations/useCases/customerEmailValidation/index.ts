import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository, } from "../../infra/repositories/customer";
import { CustomerEmailValidation } from "./customerEmailValidation";
import { CustomerEmailValidationController } from "./customerEmailValidationController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const emailValidated: CustomerEmailValidation = new CustomerEmailValidation(mongooseCustomerRepository, s3Service);
export const emailValidatedController: CustomerEmailValidationController = new CustomerEmailValidationController(emailValidated);
