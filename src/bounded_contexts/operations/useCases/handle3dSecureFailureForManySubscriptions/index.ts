import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { Handle3dSecureFailureForManySubscriptions } from "./handle3dSecureFailureForManySubscriptions";
import { Handle3dSecureFailureForManySubscriptionsController } from "./handle3dSecureFailureForManySubscriptionsController";

export const handle3dSecureFailureForManySubscriptions: Handle3dSecureFailureForManySubscriptions =
    new Handle3dSecureFailureForManySubscriptions(mongooseSubscriptionRepository, mongoosePaymentOrderReposiotry, mongooseOrderRepository);
export const handle3dSecureFailureForManySubscriptionsController = new Handle3dSecureFailureForManySubscriptionsController(
    handle3dSecureFailureForManySubscriptions
);
