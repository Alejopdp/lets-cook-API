import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetPaymentOrderById } from "./getPaymentOrderById";
import { GetPaymentOrderByIdController } from "./getPaymentOrderByIdController";
import { GetPaymentOrderByIdPresenter } from "./getPaymentOrderByIdPresenter";

export const getPaymentOrderById: GetPaymentOrderById = new GetPaymentOrderById(
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository,
    mongooseCustomerRepository,
    mongooseSubscriptionRepository
);
export const getPaymentOrderByIdPresenter: GetPaymentOrderByIdPresenter = new GetPaymentOrderByIdPresenter(v3S3Service);
export const getPaymentOrderByIdController: GetPaymentOrderByIdController = new GetPaymentOrderByIdController(
    getPaymentOrderById,
    getPaymentOrderByIdPresenter
);
