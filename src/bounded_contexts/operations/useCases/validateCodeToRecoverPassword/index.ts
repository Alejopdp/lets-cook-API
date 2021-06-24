import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository, } from "../../infra/repositories/customer";
import { CodeValidation } from "./codeValidation";
import { CodeValidationController } from "./codeValidationController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const codeValidation: CodeValidation = new CodeValidation(mongooseCustomerRepository, s3Service);
export const codeValidationController: CodeValidationController = new CodeValidationController(codeValidation);
