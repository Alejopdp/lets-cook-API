import { jwtTokenService } from "../../application/tokenService";
import { mockUserRepository, mongooseUserRepository } from "../../infra/repositories/user";
import { LoginWithEmail } from "./loginWithEmail";
import { LoginWithEmailController } from "./loginWithEmailController";

// export const loginWithEmail: LoginWithEmail = new LoginWithEmail(mockUserRepository, jwtTokenService);
export const loginWithEmail: LoginWithEmail = new LoginWithEmail(mongooseUserRepository, jwtTokenService);
export const loginWithEmailController: LoginWithEmailController = new LoginWithEmailController(loginWithEmail);
