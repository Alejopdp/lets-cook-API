import { s3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { GetPaymentOrderById } from "./getPaymentOrderById";
import { GetPaymentOrderByIdController } from "./getPaymentOrderByIdController";
import { GetPaymentOrderByIdPresenter } from "./getPaymentOrderByIdPresenter";

export const getPaymentOrderById: GetPaymentOrderById = new GetPaymentOrderById(mongoosePaymentOrderReposiotry, mongooseOrderRepository);
export const getPaymentOrderByIdPresenter: GetPaymentOrderByIdPresenter = new GetPaymentOrderByIdPresenter(s3Service);
export const getPaymentOrderByIdController: GetPaymentOrderByIdController = new GetPaymentOrderByIdController(
    getPaymentOrderById,
    getPaymentOrderByIdPresenter
);
