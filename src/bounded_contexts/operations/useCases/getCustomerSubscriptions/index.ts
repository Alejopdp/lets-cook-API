import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetCustomerSubscriptions } from "./getCustomerSubscriptions";
import { GetCustomersubscriptionsController } from "./getCustomerSubscriptionsController";

export const getCustomerSubscriptions: GetCustomerSubscriptions = new GetCustomerSubscriptions(
    mongooseSubscriptionRepository,
    mongoosePlanRepository
);
export const getCustomerSusbcriptionsController: GetCustomersubscriptionsController = new GetCustomersubscriptionsController(
    getCustomerSubscriptions
);
