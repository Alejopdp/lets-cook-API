import { jwtTokenService } from "../../../IAM/application/tokenService";
import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { LoginWithSocialNetwork } from "./loginWithSocialNetwork";
import { LoginWithSocialMediaController } from "./loginWithSocialNetworkController";

// export const loginWithEmail: LoginWithEmail = new LoginWithEmail(mockUserRepository, jwtTokenService);
export const socialNetworkAuth: LoginWithSocialNetwork = new LoginWithSocialNetwork(mongooseCustomerRepository, jwtTokenService, stripeService);
export const socialNetworkAuthController: LoginWithSocialMediaController = new LoginWithSocialMediaController(socialNetworkAuth);
