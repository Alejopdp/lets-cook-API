import { jwtTokenService } from "../../../IAM/application/tokenService";
import { awsSesService } from "../../../../shared/notificationService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { SendUpdateEmailEmail } from "./sendUpdateEmailEmail";
import { SendNewSubscriptionEmailController } from "./sendUpdateEmailEmailController";

export const sendUpdateEmailEmail: SendUpdateEmailEmail = new SendUpdateEmailEmail(
    mongooseCustomerRepository,
    awsSesService,
    jwtTokenService
);

export const sendUpdateEmailEmailController: SendNewSubscriptionEmailController = new SendNewSubscriptionEmailController(
    sendUpdateEmailEmail
);
