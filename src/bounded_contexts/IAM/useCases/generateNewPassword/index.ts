import { mockUserRepository } from "../../infra/repositories/user";
import { GenerateNewPassword } from "./generateNewPassword";
import { GenerateNewPasswordController } from "./generateNewPasswordController";

export const generateNewPassword: GenerateNewPassword = new GenerateNewPassword(mockUserRepository);
export const generateNewPasswordController: GenerateNewPasswordController = new GenerateNewPasswordController(generateNewPassword);
