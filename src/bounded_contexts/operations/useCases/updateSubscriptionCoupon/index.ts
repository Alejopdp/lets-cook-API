import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { isCouponValid } from "../../services/isCouponValid";
import { UpdateSubscriptionCoupon } from "./updateSubscriptionCoupon";
import { UpdateSubscriptionCouponController } from "./updateSubscriptionCouponController";

export const updateSubscriptionCoupon: UpdateSubscriptionCoupon = new UpdateSubscriptionCoupon(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseCouponRepository,
    isCouponValid,
    mongooseShippingZoneRepository
);
export const updateSubscriptionCouponController: UpdateSubscriptionCouponController = new UpdateSubscriptionCouponController(
    updateSubscriptionCoupon
);
