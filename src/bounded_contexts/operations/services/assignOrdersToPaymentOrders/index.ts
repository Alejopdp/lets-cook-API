import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { AssignOrdersToPaymentOrders } from "./assignOrdersToPaymentOrders";

export const assignOrdersToPaymentOrder: AssignOrdersToPaymentOrders = new AssignOrdersToPaymentOrders(mongoosePaymentOrderReposiotry);
