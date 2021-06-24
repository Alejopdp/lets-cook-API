import { awsSesService } from "../../../../shared/notificationService";
import { jwtTokenService } from "../../../IAM/application/tokenService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { ForgotPassword } from "./forgotPassword";
import { ForgotPasswordController } from "./forgotPasswordController";

// export const forgotPassword: ForgotPassword = new ForgotPassword(mockUserRepository, nodemailerService, jwtTokenService);
export const forgotPassword: ForgotPassword = new ForgotPassword(mongooseCustomerRepository, awsSesService, jwtTokenService);
export const forgotPasswordController: ForgotPasswordController = new ForgotPasswordController(forgotPassword);
