import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { updateDiscountAfterSkippingOrdersService } from "../../services/updateDiscountsAfterSkippingOrders";
import { SkipOrders } from "./skipOrders";
import { SkipOrdersController } from "./skipOrdersController";

export const skipOrders: SkipOrders = new SkipOrders(
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseLogRepository,
    mongooseRateRepository,
    mongooseSubscriptionRepository,
    updateDiscountAfterSkippingOrdersService
);
export const skipOrdersController: SkipOrdersController = new SkipOrdersController(skipOrders);
