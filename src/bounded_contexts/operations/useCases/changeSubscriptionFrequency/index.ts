import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { ChangeSubscriptionFrequency } from "./changeSubscriptionFrequency";
import { ChangeSubscriptionFrequencyController } from "./changeSubscriptionFrequencyController";

export const changeSubscriptionFrequency: ChangeSubscriptionFrequency = new ChangeSubscriptionFrequency(
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseSubscriptionRepository,
    mongooseWeekRepository
);
export const changeSubscriptionFrequencyController: ChangeSubscriptionFrequencyController = new ChangeSubscriptionFrequencyController(
    changeSubscriptionFrequency
);
