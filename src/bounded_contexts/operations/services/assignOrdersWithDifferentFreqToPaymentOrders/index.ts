import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { createPaymentOrdersService } from "../createPaymentOrders";
import { createPaymentOrdersForDifferentFreqOrders } from "../createPaymentOrdersForDifferentFreqOrders";
import { AssignOrdersWithDifferentFreqToPaymentOrders } from "./assignOrdersWithDifferentFreqToPaymentOrders";

export const assignOrdersWithDifferentFreqToPaymentOrders: AssignOrdersWithDifferentFreqToPaymentOrders =
    new AssignOrdersWithDifferentFreqToPaymentOrders(mongoosePaymentOrderReposiotry, createPaymentOrdersForDifferentFreqOrders);
