import { awsSesService } from "../../../../shared/notificationService";
import { stripeService } from "../../application/paymentService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { assignOrdersToPaymentOrder } from "../../services/assignOrdersToPaymentOrders";
import { ReorderPlan } from "./reorderPlan";
import { ReorderPlanController } from "./reorderPlanController";
import { ReorderPlanPresenter } from "./reorderPlanPresenter";

export const reorderPlan: ReorderPlan = new ReorderPlan(
    mongooseSubscriptionRepository,
    mongooseShippingZoneRepository,
    mongooseWeekRepository,
    mongooseOrderRepository,
    stripeService,
    awsSesService,
    assignOrdersToPaymentOrder,
    mongoosePaymentOrderReposiotry
);
export const reorderPlanPresenter: ReorderPlanPresenter = new ReorderPlanPresenter();
export const reorderPlanController: ReorderPlanController = new ReorderPlanController(reorderPlan, reorderPlanPresenter);
