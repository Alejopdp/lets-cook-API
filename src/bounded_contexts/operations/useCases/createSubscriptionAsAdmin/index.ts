import { CreateSubscriptionAsAdmin } from "./createSubscriptionAsAdmin";
import { CreateSubscriptionAsAdminPresenter } from "./createSubscriptionAsAdminPresenter";
import { CreateSubscriptionAsAdminController } from "./createSubscriptionAsAdminController";
import { awsSesV3Service } from "../../../../shared/notificationService";
import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { assignOrdersToPaymentOrder } from "../../services/assignOrdersToPaymentOrders";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";

export const createSubscriptionAsAdmin: CreateSubscriptionAsAdmin = new CreateSubscriptionAsAdmin(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongooseShippingZoneRepository,
    mongoosePlanRepository,
    mongooseWeekRepository,
    mongooseOrderRepository,
    stripeService,
    awsSesV3Service,
    assignOrdersToPaymentOrder,
    mongoosePaymentOrderReposiotry,
    mongooseCouponRepository
);
export const createSubscriptionAsAdminPresenter: CreateSubscriptionAsAdminPresenter = new CreateSubscriptionAsAdminPresenter();
export const createSubscriptionAsAdminController: CreateSubscriptionAsAdminController = new CreateSubscriptionAsAdminController(
    createSubscriptionAsAdmin,
    createSubscriptionAsAdminPresenter
);
