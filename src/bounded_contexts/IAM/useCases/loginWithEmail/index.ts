import { jwtTokenService } from "../../application/tokenService";
import { mockUserRepository } from "../../infra/repositories/user";
import { LoginWithEmail } from "./loginWithEmail";
import { LoginWithEmailController } from "./loginWithEmailController";

export const loginWithEmail: LoginWithEmail = new LoginWithEmail(mockUserRepository, jwtTokenService);
export const loginWithEmailController: LoginWithEmailController = new LoginWithEmailController(loginWithEmail);
