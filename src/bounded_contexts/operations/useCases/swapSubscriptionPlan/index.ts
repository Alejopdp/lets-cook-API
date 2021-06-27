import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { SwapSubscriptionPlan } from "./swapSubscriptionPlan";
import { SwapSubscriptionPlanController } from "./swapSubscriptionPlanController";

export const swapSubscriptionPlan: SwapSubscriptionPlan = new SwapSubscriptionPlan(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePlanRepository
);
export const swapSubscriptionPlanController: SwapSubscriptionPlanController = new SwapSubscriptionPlanController(swapSubscriptionPlan);
