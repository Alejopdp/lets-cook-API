import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { UpdatePaymentOrderAndOrdersState } from "./updatePaymentOrderAndOrdersState";
import { UpdatePaymentOrderAndOrdersStateController } from "./updatePaymentOrderAndOrdersStateController";

export const updatePaymentOrderAndOrdersState: UpdatePaymentOrderAndOrdersState = new UpdatePaymentOrderAndOrdersState(
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository
);
export const updatePaymentOrderAndOrdersStateController = new UpdatePaymentOrderAndOrdersStateController(updatePaymentOrderAndOrdersState);
