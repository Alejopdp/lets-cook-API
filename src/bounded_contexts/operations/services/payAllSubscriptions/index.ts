import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { PayAllSubscriptions } from "./payAllSubscriptions";

export const payAllSubscriptions: PayAllSubscriptions = new PayAllSubscriptions(
    mongooseCustomerRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    stripeService
);
