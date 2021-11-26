import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { SwapSubscriptionPlan } from "./swapSubscriptionPlan";
import { SwapSubscriptionPlanController } from "./swapSubscriptionPlanController";

export const swapSubscriptionPlan: SwapSubscriptionPlan = new SwapSubscriptionPlan(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePlanRepository,
    mongoosePaymentOrderReposiotry,
    mongooseCouponRepository,
    mongooseShippingZoneRepository
);
export const swapSubscriptionPlanController: SwapSubscriptionPlanController = new SwapSubscriptionPlanController(swapSubscriptionPlan);
