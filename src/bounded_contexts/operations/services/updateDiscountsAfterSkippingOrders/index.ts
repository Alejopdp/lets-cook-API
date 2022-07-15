import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { UpdateDiscountAfterSkippingOrders } from "./updateDiscountsAfterSkippingOrders";

export const updateDiscountAfterSkippingOrdersService = new UpdateDiscountAfterSkippingOrders(mongooseSubscriptionRepository, mongooseOrderRepository, mongoosePaymentOrderReposiotry, mongooseShippingZoneRepository)