import { jwtTokenService } from "../../../IAM/application/tokenService";
import { mailerLiteService } from "../../application/mailingListService";
import { stripeService } from "../../application/paymentService";
import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { CustomerSignUpPresenter } from "./customerSignUpPresenter";
import { SignUp } from "./signUp";
import { SignUpController } from "./signUpController";

export const signUp: SignUp = new SignUp(mongooseCustomerRepository, v3S3Service, stripeService, jwtTokenService, mailerLiteService);
export const customerSignUpPresenter = new CustomerSignUpPresenter();
export const signUpController: SignUpController = new SignUpController(signUp, customerSignUpPresenter);
