import { awsSesService } from "../../../../shared/notificationService";
import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { assignOrdersToPaymentOrder } from "../../services/assignOrdersToPaymentOrders";
import { CreateSubscription } from "./createSubscription";
import { CreateSubscriptionController } from "./createSubscriptionController";
import { CreateSubscriptionPresenter } from "./createSubscriptionPresenter";

export const createSubscription: CreateSubscription = new CreateSubscription(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongooseShippingZoneRepository,
    mongoosePlanRepository,
    mongooseWeekRepository,
    mongooseOrderRepository,
    stripeService,
    awsSesService,
    assignOrdersToPaymentOrder,
    mongoosePaymentOrderReposiotry
);
export const createSubscriptionPresenter: CreateSubscriptionPresenter = new CreateSubscriptionPresenter();
export const createSubscriptionController: CreateSubscriptionController = new CreateSubscriptionController(
    createSubscription,
    createSubscriptionPresenter
);
