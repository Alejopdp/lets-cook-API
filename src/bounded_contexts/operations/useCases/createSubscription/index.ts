import { CreateSubscription } from "./createSubscription";
import { CreateSubscriptionController } from "./createSubscriptionController";

export const createSubscription: CreateSubscription = new CreateSubscription();
export const createSubscriptionController: CreateSubscriptionController = new CreateSubscriptionController(createSubscription);
