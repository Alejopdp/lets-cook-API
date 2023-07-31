import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetCustomerInformationAsAdmin } from "./getCustomerInformationAsAdmin";
import { GetCustomerInformationAsAdminController } from "./getCustomerInformationAsAdminController";
import { GetCustomerInformationAsAdminPresenter } from "./getCustomerInformationAsAdminPresenter";

export const getCustomerInformationAsAdmin: GetCustomerInformationAsAdmin = new GetCustomerInformationAsAdmin(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    mongoosePaymentOrderReposiotry,
    mongooseOrderRepository,
    v3S3Service
);
export const getCustomerInformationAsAdminPresenter: GetCustomerInformationAsAdminPresenter = new GetCustomerInformationAsAdminPresenter();
export const getCustomerInformationAsAdminController: GetCustomerInformationAsAdminController = new GetCustomerInformationAsAdminController(
    getCustomerInformationAsAdmin,
    getCustomerInformationAsAdminPresenter
);
