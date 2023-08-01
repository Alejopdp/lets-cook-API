import { awsSesV3Service } from "../../../../shared/notificationService";
import { stripeService } from "../../application/paymentService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { assignOrdersToPaymentOrder } from "../../services/assignOrdersToPaymentOrders";
import { createFriendCode } from "../../services/createFriendCode";
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
    mongooseCouponRepository,
    stripeService,
    awsSesV3Service,
    assignOrdersToPaymentOrder,
    mongoosePaymentOrderReposiotry,
    mongooseLogRepository,
    createFriendCode
);
export const createSubscriptionPresenter: CreateSubscriptionPresenter = new CreateSubscriptionPresenter();
export const createSubscriptionController: CreateSubscriptionController = new CreateSubscriptionController(
    createSubscription,
    createSubscriptionPresenter
);
