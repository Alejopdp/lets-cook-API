import { s3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { UpdatePlan } from "./updatePlan";
import { UpdatePlanController } from "./updatePlanController";

// export const updatePlan: UpdatePlan = new UpdatePlan(mockPlanRepository, s3Service);
export const updatePlan: UpdatePlan = new UpdatePlan(
    mongoosePlanRepository,
    mongooseSubscriptionRepository,
    s3Service,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry
);
export const updatePlanController: UpdatePlanController = new UpdatePlanController(updatePlan);
