import { v3S3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetSubscriptionById } from "./getSubscriptionById";
import { GetSubscriptionByIdController } from "./getSubscriptionByIdController";
import { GetSubscriptionByIdPresenter } from "./getSubscriptionByIdPresenter";

const getSubscriptionByIdPresenter: GetSubscriptionByIdPresenter = new GetSubscriptionByIdPresenter(v3S3Service);
export const getSubscriptionById: GetSubscriptionById = new GetSubscriptionById(
    mongooseSubscriptionRepository,
    mongooseOrderRepository,
    mongoosePaymentOrderReposiotry,
    mongooseWeekRepository,
    getSubscriptionByIdPresenter
);

export const getSubscriptionByIdController: GetSubscriptionByIdController = new GetSubscriptionByIdController(
    getSubscriptionById
);
