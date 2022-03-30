import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { MoveNextBillingDate } from "./moveNextBillingDate";
import { MoveNextBillingDateController } from "./moveNextBillingDateController";
import { MoveNextBillingDatePresenter } from "./moveNextBillingDatePresenter";

export const moveNextBillingDate: MoveNextBillingDate = new MoveNextBillingDate(
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseSubscriptionRepository,
    mongooseWeekRepository
);
export const moveNextBillingDatePresenter: MoveNextBillingDatePresenter = new MoveNextBillingDatePresenter();
export const moveNextBillingDateController: MoveNextBillingDateController = new MoveNextBillingDateController(
    moveNextBillingDate,
    moveNextBillingDatePresenter
);
