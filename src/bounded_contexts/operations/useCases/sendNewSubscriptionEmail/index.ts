import { awsSesService } from "../../../../shared/notificationService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { SendNewSubscriptionEmail } from "./sendNewSubscriptionEmail";
import { SendNewSubscriptionEmailController } from "./sendNewSubscriptionEmailController";

export const sendNewSubscriptionEmail: SendNewSubscriptionEmail = new SendNewSubscriptionEmail(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongooseShippingZoneRepository,
    awsSesService
);

export const sendNewSubscriptionEmailController: SendNewSubscriptionEmailController = new SendNewSubscriptionEmailController(
    sendNewSubscriptionEmail
);
