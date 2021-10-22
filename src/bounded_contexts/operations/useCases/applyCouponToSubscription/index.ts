import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { isCouponValid } from "../../services/isCouponValid";
import { ApplyCouponToSubscription } from "./applyCouponToSubscription";
import { ApplyCouponToSubscriptionController } from "./applyCouponToSubscriptionController";

export const applyCouponToSubscription: ApplyCouponToSubscription = new ApplyCouponToSubscription(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseCouponRepository,
    mongooseShippingZoneRepository,
    isCouponValid
);
export const applyCouponToSubscriptionController: ApplyCouponToSubscriptionController = new ApplyCouponToSubscriptionController(
    applyCouponToSubscription
);
