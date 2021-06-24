import { jwtTokenService } from "../../../IAM/application/tokenService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { LoginWithEmail } from "./loginWithEmail";
import { LoginWithEmailController } from "./loginWithEmailController";

// export const loginWithEmail: LoginWithEmail = new LoginWithEmail(mockUserRepository, jwtTokenService);
export const signIn: LoginWithEmail = new LoginWithEmail(mongooseCustomerRepository, jwtTokenService);
export const signInController: LoginWithEmailController = new LoginWithEmailController(signIn);
