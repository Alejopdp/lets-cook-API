import { awsSesService } from "../../../../shared/notificationService";
import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { UpdateCustomerShipping } from "./updateCustomerShipping";
import { UpdateCustomerShippingController } from "./updateCustomerShippingController";

export const updateShippingCustomer: UpdateCustomerShipping = new UpdateCustomerShipping(
    mongooseCustomerRepository,
    mongoosePaymentOrderReposiotry,
    mongooseShippingZoneRepository,
    s3Service,
    awsSesService
);
export const updateShippingCustomerController = new UpdateCustomerShippingController(updateShippingCustomer);
