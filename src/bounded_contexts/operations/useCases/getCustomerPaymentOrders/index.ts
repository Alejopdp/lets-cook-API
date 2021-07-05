import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { GetCustomerPaymentOrders } from "./getCustomerPaymentOrders";
import { GetCustomerPaymentOrdersController } from "./getCustomerPaymentOrdersController";
import { GetCustomerPaymentOrdersPresenter } from "./getCustomerPaymentOrdersPresenter";

export const getCustomerPaymentOrders: GetCustomerPaymentOrders = new GetCustomerPaymentOrders(
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository
);
export const getCustomerPaymentOrdersPresenter: GetCustomerPaymentOrdersPresenter = new GetCustomerPaymentOrdersPresenter();
export const getCustomerPaymentOrdersController: GetCustomerPaymentOrdersController = new GetCustomerPaymentOrdersController(
    getCustomerPaymentOrders,
    getCustomerPaymentOrdersPresenter
);
