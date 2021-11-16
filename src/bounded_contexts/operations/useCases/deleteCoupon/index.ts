import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { DeleteCoupon } from "./deleteCoupon";
import { DeleteCouponController } from "./deleteCouponController";

export const deleteCoupon: DeleteCoupon = new DeleteCoupon(
    mongooseCouponRepository,
    mongooseSubscriptionRepository,
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository
);
export const deleteCouponController: DeleteCouponController = new DeleteCouponController(deleteCoupon);
