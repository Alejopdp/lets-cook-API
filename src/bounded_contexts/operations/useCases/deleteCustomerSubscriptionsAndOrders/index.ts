import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { DeleteCustomerSubscriptionsAndOrders } from "./deleteCustomerSubscriptionsAndOrders";
import { DeleteCustomerSubscriptionsAndOrdersController } from "./deleteCustomerSubscriptionsAndOrdersController";

export const deleteCustomerSubscriptionsAndOrders = new DeleteCustomerSubscriptionsAndOrders(mongooseSubscriptionRepository, mongooseOrderRepository, mongoosePaymentOrderReposiotry)
export const deleteCustomerSubscriptionsAndOrdersController = new DeleteCustomerSubscriptionsAndOrdersController(deleteCustomerSubscriptionsAndOrders)