import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository, } from "../../infra/repositories/customer";
import { CodeValidation } from "./codeValidation";
import { CodeValidationController } from "./codeValidationController";

export const codeValidation: CodeValidation = new CodeValidation(mongooseCustomerRepository, v3S3Service);
export const codeValidationController: CodeValidationController = new CodeValidationController(codeValidation);
