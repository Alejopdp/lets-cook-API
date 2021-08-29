import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { ChargeOnePaymentOrder } from "./chargeOnePaymentOrder";
import { ChargeOnePaymentOrderController } from "./chargeOnePaymentOrderController";
import { ChargeOnePaymentOrderPresenter } from "./chargeOnePaymentOrderPresenter";

export const chargeOnePaymentOrder: ChargeOnePaymentOrder = new ChargeOnePaymentOrder(
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseShippingZoneRepository,
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongooseWeekRepository,
    stripeService
);
export const chargeOnePaymentOrderPresenter: ChargeOnePaymentOrderPresenter = new ChargeOnePaymentOrderPresenter();
export const chargeOnePaymentOrderController: ChargeOnePaymentOrderController = new ChargeOnePaymentOrderController(
    chargeOnePaymentOrder,
    chargeOnePaymentOrderPresenter
);
