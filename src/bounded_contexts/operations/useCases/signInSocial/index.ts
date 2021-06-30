import { jwtTokenService } from "../../../IAM/application/tokenService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { LoginWithSocialNetwork } from "./loginWithSocialNetwork";
import { LoginWithSocialMediaController } from "./loginWithSocialNetworkController";

// export const loginWithEmail: LoginWithEmail = new LoginWithEmail(mockUserRepository, jwtTokenService);
export const socialNetworkAuth: LoginWithSocialNetwork = new LoginWithSocialNetwork(mongooseCustomerRepository, jwtTokenService);
export const socialNetworkAuthController: LoginWithSocialMediaController = new LoginWithSocialMediaController(socialNetworkAuth);
