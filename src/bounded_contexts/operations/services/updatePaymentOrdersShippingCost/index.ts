import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { UpdatePaymentOrdersShippingCost } from "./updatePaymentOrdersShippingCost";

export const updatePaymentOrdersShippingCost: UpdatePaymentOrdersShippingCost = new UpdatePaymentOrdersShippingCost(
    mongooseCustomerRepository,
    mongoosePaymentOrderReposiotry
);
