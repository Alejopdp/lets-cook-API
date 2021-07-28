import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { GetPaymentOrdersAsAdmin } from "./getPaymentOrdersAsAdmin";
import { GetPaymentOrdersAsAdminController } from "./getPaymentOrdersAsAdminController";
import { GetPaymentOrdersAsAdminPresenter } from "./getPaymentOrdersAsAdminPresenter";

export const getPaymentOrdersAsAdmin: GetPaymentOrdersAsAdmin = new GetPaymentOrdersAsAdmin(
    mongoosePaymentOrderReposiotry,
    mongooseCustomerRepository
);
export const getPaymentOrdersAsAdminPresenter: GetPaymentOrdersAsAdminPresenter = new GetPaymentOrdersAsAdminPresenter();
export const getPaymentOrdersAsAdminController: GetPaymentOrdersAsAdminController = new GetPaymentOrdersAsAdminController(
    getPaymentOrdersAsAdmin,
    getPaymentOrdersAsAdminPresenter
);
