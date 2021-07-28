import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { GetPaymentOrderById } from "./getPaymentOrderById";
import { GetPaymentOrderByIdController } from "./getPaymentOrderByIdController";
import { GetPaymentOrderByIdPresenter } from "./getPaymentOrderByIdPresenter";

export const getPaymentOrderById: GetPaymentOrderById = new GetPaymentOrderById(
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository,
    mongooseCustomerRepository
);
export const getPaymentOrderByIdPresenter: GetPaymentOrderByIdPresenter = new GetPaymentOrderByIdPresenter(s3Service);
export const getPaymentOrderByIdController: GetPaymentOrderByIdController = new GetPaymentOrderByIdController(
    getPaymentOrderById,
    getPaymentOrderByIdPresenter
);
