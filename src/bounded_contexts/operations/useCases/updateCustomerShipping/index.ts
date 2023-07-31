import { awsSesV3Service } from "../../../../shared/notificationService";
import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { UpdateCustomerShipping } from "./updateCustomerShipping";
import { UpdateCustomerShippingController } from "./updateCustomerShippingController";

export const updateShippingCustomer: UpdateCustomerShipping = new UpdateCustomerShipping(
    mongooseCustomerRepository,
    mongoosePaymentOrderReposiotry,
    mongooseShippingZoneRepository,
    s3Service,
    awsSesV3Service,
    mongooseOrderRepository,
    mongooseLogRepository
);
export const updateShippingCustomerController = new UpdateCustomerShippingController(updateShippingCustomer);
