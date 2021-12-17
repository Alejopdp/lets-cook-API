import { CancelAPaymentOrder } from "./cancelAPaymentOrder";
import { CancelAPaymentOrderController } from "./cancelAPaymentOrderController";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseOrderRepository } from "../../infra/repositories/order";

export const cancelAPaymentOrder: CancelAPaymentOrder = new CancelAPaymentOrder(mongoosePaymentOrderReposiotry, mongooseOrderRepository);
export const cancelAPaymentOrderController: CancelAPaymentOrderController = new CancelAPaymentOrderController(cancelAPaymentOrder);
