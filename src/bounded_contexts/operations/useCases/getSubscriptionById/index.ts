import { s3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetSubscriptionById } from "./getSubscriptionById";
import { GetSubscriptionByIdController } from "./getSubscriptionByIdController";
import { GetSubscriptionByIdPresenter } from "./getSubscriptionByIdPresenter";

export const getSubscriptionById: GetSubscriptionById = new GetSubscriptionById(mongooseSubscriptionRepository, mongooseOrderRepository);
export const getSubscriptionByIdPresenter: GetSubscriptionByIdPresenter = new GetSubscriptionByIdPresenter(s3Service);
export const getSubscriptionByIdController: GetSubscriptionByIdController = new GetSubscriptionByIdController(
    getSubscriptionById,
    getSubscriptionByIdPresenter
);
