import { CancelASubscription } from "./cancelASubscription";
import { CancelASubscriptionController } from "./cancelASubscriptionController";

export const cancelASubscription: CancelASubscription = new CancelASubscription();
export const cancelASubscriptionControlelr: CancelASubscriptionController = new CancelASubscriptionController(cancelASubscription);
