import { awsSesV3Service } from "../../../../shared/notificationService/index";
import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { PayAllSubscriptions } from "./payAllSubscriptions";

export const payAllSubscriptions: PayAllSubscriptions = new PayAllSubscriptions(
    mongooseCustomerRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    stripeService,
    mongooseSubscriptionRepository,
    mongooseWeekRepository,
    mongooseShippingZoneRepository,
    awsSesV3Service
);
