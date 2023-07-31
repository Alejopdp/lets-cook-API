import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetOrderById } from "./getOrderById";
import { GetOrderByIdController } from "./getOrderByIdController";
import { GetOrderByIdPresenter } from "./getOrderByIdPresenter";

export const getOrderById: GetOrderById = new GetOrderById(
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository,
    mongooseCustomerRepository,
    mongooseSubscriptionRepository
);
export const getOrderByIdPresenter: GetOrderByIdPresenter = new GetOrderByIdPresenter(v3S3Service);
export const getOrderByIdController: GetOrderByIdController = new GetOrderByIdController(getOrderById, getOrderByIdPresenter);
