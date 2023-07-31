import { awsSesV3Service } from "../../../../shared/notificationService";
import { jwtTokenService } from "../../application/tokenService";
import { mongooseUserRepository } from "../../infra/repositories/user";
import { ForgotPassword } from "./forgotPassword";
import { ForgotPasswordController } from "./forgotPasswordController";

export const forgotPassword: ForgotPassword = new ForgotPassword(mongooseUserRepository, awsSesV3Service, jwtTokenService);
export const forgotPasswordController: ForgotPasswordController = new ForgotPasswordController(forgotPassword);
