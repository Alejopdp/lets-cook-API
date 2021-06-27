import { mongooseOrderRepository } from "../../infra/repositories/order";
import { GetNextOrdersBySubscription } from "./getNextOrdersBySubscription";
import { GetNextOrdersBySubscriptionController } from "./getNextOrdersBySubscriptionController";

export const getNextOrdersBySubscription: GetNextOrdersBySubscription = new GetNextOrdersBySubscription(mongooseOrderRepository);
export const getNextOrdersBySubscriptionController: GetNextOrdersBySubscriptionController = new GetNextOrdersBySubscriptionController(
    getNextOrdersBySubscription
);
