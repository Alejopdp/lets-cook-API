import { awsSesV3Service } from "../../../../shared/notificationService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { SendNewSubscriptionEmail } from "./sendNewSubscriptionEmail";
import { SendNewSubscriptionEmailController } from "./sendNewSubscriptionEmailController";

export const sendNewSubscriptionEmail: SendNewSubscriptionEmail = new SendNewSubscriptionEmail(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongooseShippingZoneRepository,
    awsSesV3Service,
    mongoosePaymentOrderReposiotry
);

export const sendNewSubscriptionEmailController: SendNewSubscriptionEmailController = new SendNewSubscriptionEmailController(
    sendNewSubscriptionEmail
);
