import { nodemailerService } from "../../../../shared/notificationService";
import { jwtTokenService } from "../../application/tokenService";
import { mockUserRepository } from "../../infra/repositories/user";
import { ForgotPassword } from "./forgotPassword";
import { ForgotPasswordController } from "./forgotPasswordController";

export const forgotPassword: ForgotPassword = new ForgotPassword(mockUserRepository, nodemailerService, jwtTokenService);
export const forgotPasswordController: ForgotPasswordController = new ForgotPasswordController(forgotPassword);
