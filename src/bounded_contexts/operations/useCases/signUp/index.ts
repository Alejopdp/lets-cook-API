import { stripeService } from "../../application/paymentService";
import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { CustomerSignUpPresenter } from "./customerSignUpPresenter";
import { SignUp } from "./signUp";
import { SignUpController } from "./signUpController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const signUp: SignUp = new SignUp(mongooseCustomerRepository, s3Service, stripeService);
export const customerSignUpPresenter = new CustomerSignUpPresenter();
export const signUpController: SignUpController = new SignUpController(signUp, customerSignUpPresenter);
