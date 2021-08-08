import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { Handle3dSecureFailure } from "./handle3dSecureFailure";
import { Handle3dSecureFailureController } from "./handle3dSecureFailureController";

export const handle3dSecureFailure: Handle3dSecureFailure = new Handle3dSecureFailure(
    mongooseSubscriptionRepository,
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository
);
export const handle3dSecureFailureController = new Handle3dSecureFailureController(handle3dSecureFailure);
