import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { DeleteSubscription } from "./deleteSubscription";
import { DeleteSubscriptionController } from "./deleteSubscriptionController";

export const deleteSubscription: DeleteSubscription = new DeleteSubscription(mongooseSubscriptionRepository, mongooseOrderRepository);
export const deleteSubscriptionController: DeleteSubscriptionController = new DeleteSubscriptionController(deleteSubscription);
