import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { DeleteSubscription } from "./deleteSubscription";
import { DeleteSubscriptionController } from "./deleteSubscriptionController";

export const deleteSubscription: DeleteSubscription = new DeleteSubscription(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseLogRepository
);
export const deleteSubscriptionController: DeleteSubscriptionController = new DeleteSubscriptionController(deleteSubscription);
