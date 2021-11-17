import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { MoveOrderShippingDate } from "./moveOrderShippingDate";
import { MoveOrderShippingDateController } from "./moveOrderShippingDateController";
import { MoveOrderShippingDatePresenter } from "./moveOrderShippingDatePresenter";

export const moveOrderShippingDate: MoveOrderShippingDate = new MoveOrderShippingDate(
    mongooseOrderRepository,
    mongooseSubscriptionRepository,
    mongoosePaymentOrderReposiotry,
    mongooseWeekRepository
);
export const moveOrderShippingDatePresenter: MoveOrderShippingDatePresenter = new MoveOrderShippingDatePresenter();
export const moveOrderShippingDateController: MoveOrderShippingDateController = new MoveOrderShippingDateController(
    moveOrderShippingDate,
    moveOrderShippingDatePresenter
);
