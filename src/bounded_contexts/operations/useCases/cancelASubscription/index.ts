import { awsSesService } from "../../../../shared/notificationService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { CancelASubscription } from "./cancelASubscription";
import { CancelASubscriptionController } from "./cancelASubscriptionController";

export const cancelASubscription: CancelASubscription = new CancelASubscription(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    awsSesService
);
export const cancelASubscriptionController: CancelASubscriptionController = new CancelASubscriptionController(cancelASubscription);
