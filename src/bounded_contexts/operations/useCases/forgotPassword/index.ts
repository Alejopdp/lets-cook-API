import { awsSesV3Service } from "../../../../shared/notificationService";
import { jwtTokenService } from "../../../IAM/application/tokenService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { ForgotPassword } from "./forgotPassword";
import { ForgotPasswordController } from "./forgotPasswordController";

export const forgotPassword: ForgotPassword = new ForgotPassword(mongooseCustomerRepository, awsSesV3Service, jwtTokenService);
export const forgotPasswordController: ForgotPasswordController = new ForgotPasswordController(forgotPassword);
