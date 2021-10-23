import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { RetryPaymentOfRejectedPaymentOrder } from "./retryPaymentOfRejectedPaymentOrder";
import { RetryPaymentOfRejectedPaymentOrderController } from "./retryPaymentOfRejectedPaymentOrderController";
import { RetryPaymentOfRejectedPaymentOrderDto } from "./retryPaymentOfRejectedPaymentOrderDto";
import { RetryPaymentOfRejectedPaymentOrderPresenter } from "./retryPaymentOfRejectedPaymentOrderPresenter";

export const retryPaymentOrderOfRejectedPaymentOrder: RetryPaymentOfRejectedPaymentOrder = new RetryPaymentOfRejectedPaymentOrder(
    mongoosePaymentOrderReposiotry,
    mongooseCustomerRepository,
    stripeService,
    mongooseOrderRepository
);
export const retryPaymentOrderOfRejectedPaymentOrderPresenter: RetryPaymentOfRejectedPaymentOrderPresenter =
    new RetryPaymentOfRejectedPaymentOrderPresenter();
export const retryPaymentOrderOfRejectedPaymentOrderController: RetryPaymentOfRejectedPaymentOrderController =
    new RetryPaymentOfRejectedPaymentOrderController(
        retryPaymentOrderOfRejectedPaymentOrder,
        retryPaymentOrderOfRejectedPaymentOrderPresenter
    );
