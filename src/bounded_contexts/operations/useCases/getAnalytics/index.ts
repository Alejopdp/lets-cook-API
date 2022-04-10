import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetAnalytics } from "./getAnalytics";
import { GetAnalyticsController } from "./getAnalyticsController";

export const getAnalytics = new GetAnalytics(
    mongooseWeekRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseSubscriptionRepository,
    mongooseCustomerRepository
);
export const getAnalyticsController = new GetAnalyticsController(getAnalytics);
