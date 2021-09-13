import { stripeService } from "../../application/paymentService";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { RefundPaymentOrder } from "./refundPaymentOrder";
import { RefundPaymentOrderController } from "./refundPaymentOrderController";
import { RefundPaymentOrderPresenter } from "./refundPaymentOrderPresenter";

export const refundPaymentOrder: RefundPaymentOrder = new RefundPaymentOrder(mongoosePaymentOrderReposiotry, stripeService);
export const refundPaymentOrderPresenter: RefundPaymentOrderPresenter = new RefundPaymentOrderPresenter();
export const refundPaymentOrderController: RefundPaymentOrderController = new RefundPaymentOrderController(
    refundPaymentOrder,
    refundPaymentOrderPresenter
);
