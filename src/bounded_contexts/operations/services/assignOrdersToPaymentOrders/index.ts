import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { createPaymentOrdersService } from "../createPaymentOrders";
import { AssignOrdersToPaymentOrders } from "./assignOrdersToPaymentOrders";

export const assignOrdersToPaymentOrder: AssignOrdersToPaymentOrders = new AssignOrdersToPaymentOrders(
    mongoosePaymentOrderReposiotry,
    createPaymentOrdersService
);
