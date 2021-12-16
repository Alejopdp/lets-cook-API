import { awsSesService } from "../../../../shared/notificationService";
import { mailerLiteService } from "../../application/mailingListService";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { CancelASubscription } from "./cancelASubscription";
import { CancelASubscriptionController } from "./cancelASubscriptionController";

export const cancelASubscription: CancelASubscription = new CancelASubscription(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    awsSesService,
    mailerLiteService,
    mongooseLogRepository,
    mongooseRateRepository
);
export const cancelASubscriptionController: CancelASubscriptionController = new CancelASubscriptionController(cancelASubscription);
