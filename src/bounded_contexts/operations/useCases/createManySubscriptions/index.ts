import { awsSesService } from "../../../../shared/notificationService";
import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { assignOrdersToPaymentOrder } from "../../services/assignOrdersToPaymentOrders";
import { assignOrdersWithDifferentFreqToPaymentOrders } from "../../services/assignOrdersWithDifferentFreqToPaymentOrders";
import { CreateManySubscriptionsPresenter } from "./ccreateManySubscriptionsPresenter";
import { CreateManySubscriptions } from "./createManySubscriptions";
import { CreateManySubscriptionsController } from "./createManySubscriptionsController";

export const createManySubscriptions: CreateManySubscriptions = new CreateManySubscriptions(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongooseShippingZoneRepository,
    mongoosePlanRepository,
    mongooseWeekRepository,
    mongooseOrderRepository,
    stripeService,
    awsSesService,
    assignOrdersWithDifferentFreqToPaymentOrders,
    mongoosePaymentOrderReposiotry,
    mongooseLogRepository
);

export const createManySubscriptionsPresenter: CreateManySubscriptionsPresenter = new CreateManySubscriptionsPresenter();
export const createManySubscriptionsController: CreateManySubscriptionsController = new CreateManySubscriptionsController(
    createManySubscriptions,
    createManySubscriptionsPresenter
);
