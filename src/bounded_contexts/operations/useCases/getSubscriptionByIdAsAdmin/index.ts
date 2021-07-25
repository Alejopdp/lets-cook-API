import { s3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetSubscriptionByIdAsAdmin } from "./getSubscriptionByIdAsAdmin";
import { GetSubscriptionByIdAsAdminController } from "./getSubscriptionByIdAsAdminController";
import { GetSubscriptionByIdAsAdminPresenter } from "./getSubscriptionByIdAsAdminPresenter";

export const getSubscriptionById: GetSubscriptionByIdAsAdmin = new GetSubscriptionByIdAsAdmin(
    mongooseSubscriptionRepository,
    mongooseOrderRepository
);
export const getSubscriptionByIdPresenterAsADmin: GetSubscriptionByIdAsAdminPresenter = new GetSubscriptionByIdAsAdminPresenter(s3Service);
export const getSubscriptionByIdControllerAsAdmin: GetSubscriptionByIdAsAdminController = new GetSubscriptionByIdAsAdminController(
    getSubscriptionById,
    getSubscriptionByIdPresenterAsADmin
);
