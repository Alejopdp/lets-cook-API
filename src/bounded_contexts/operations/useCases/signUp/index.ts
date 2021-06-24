import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository, } from "../../infra/repositories/customer";
import { SignUp } from "./signUp";
import { SignUpController } from "./signUpController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const signUp: SignUp = new SignUp(mongooseCustomerRepository, s3Service);
export const signUpController: SignUpController = new SignUpController(signUp);
