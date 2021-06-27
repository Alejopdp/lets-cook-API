import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { CancelASubscription } from "./cancelASubscription";
import { CancelASubscriptionController } from "./cancelASubscriptionController";

export const cancelASubscription: CancelASubscription = new CancelASubscription(mongooseSubscriptionRepository, mongooseOrderRepository);
export const cancelASubscriptionController: CancelASubscriptionController = new CancelASubscriptionController(cancelASubscription);
