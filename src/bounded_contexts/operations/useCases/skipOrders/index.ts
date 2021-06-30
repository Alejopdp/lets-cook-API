import { mongooseOrderRepository } from "../../infra/repositories/order";
import { SkipOrders } from "./skipOrders";
import { SkipOrdersController } from "./skipOrdersController";

export const skipOrders: SkipOrders = new SkipOrders(mongooseOrderRepository);
export const skipOrdersController: SkipOrdersController = new SkipOrdersController(skipOrders);
