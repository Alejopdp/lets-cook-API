import { mockUserRepository, mongooseUserRepository } from "../../infra/repositories/user";
import { GenerateNewPassword } from "./generateNewPassword";
import { GenerateNewPasswordController } from "./generateNewPasswordController";

// export const generateNewPassword: GenerateNewPassword = new GenerateNewPassword(mockUserRepository);
export const generateNewPassword: GenerateNewPassword = new GenerateNewPassword(mongooseUserRepository);
export const generateNewPasswordController: GenerateNewPasswordController = new GenerateNewPasswordController(generateNewPassword);
