import { jwtTokenService } from "../../../IAM/application/tokenService";
import { awsSesV3Service } from "../../../../shared/notificationService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { SendUpdateEmailEmail } from "./sendUpdateEmailEmail";
import { SendNewSubscriptionEmailController } from "./sendUpdateEmailEmailController";

export const sendUpdateEmailEmail: SendUpdateEmailEmail = new SendUpdateEmailEmail(
    mongooseCustomerRepository,
    awsSesV3Service,
    jwtTokenService
);

export const sendUpdateEmailEmailController: SendNewSubscriptionEmailController = new SendNewSubscriptionEmailController(
    sendUpdateEmailEmail
);
