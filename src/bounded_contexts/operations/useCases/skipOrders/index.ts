import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { SkipOrders } from "./skipOrders";
import { SkipOrdersController } from "./skipOrdersController";

export const skipOrders: SkipOrders = new SkipOrders(mongooseOrderRepository, mongoosePaymentOrderReposiotry);
export const skipOrdersController: SkipOrdersController = new SkipOrdersController(skipOrders);
