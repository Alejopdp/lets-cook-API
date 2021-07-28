import { s3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetSubscriptionByIdAsAdmin } from "./getSubscriptionByIdAsAdmin";
import { GetSubscriptionByIdAsAdminController } from "./getSubscriptionByIdAsAdminController";
import { GetSubscriptionByIdAsAdminPresenter } from "./getSubscriptionByIdAsAdminPresenter";

export const getSubscriptionById: GetSubscriptionByIdAsAdmin = new GetSubscriptionByIdAsAdmin(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry
);
export const getSubscriptionByIdAsAdminPresenter: GetSubscriptionByIdAsAdminPresenter = new GetSubscriptionByIdAsAdminPresenter(s3Service);
export const getSubscriptionByIdAsAdminController: GetSubscriptionByIdAsAdminController = new GetSubscriptionByIdAsAdminController(
    getSubscriptionById,
    getSubscriptionByIdAsAdminPresenter
);
