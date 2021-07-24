import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { recipeVariantCreator } from "../../services/recipeVariantCreator";
import { UpdateCustomerShipping } from "./updateCustomerShipping";
import { UpdateCustomerShippingController } from "./updateCustomerShippingController";

export const updateShippingCustomer: UpdateCustomerShipping = new UpdateCustomerShipping(mongooseCustomerRepository, s3Service);
export const updateShippingCustomerController = new UpdateCustomerShippingController(updateShippingCustomer);
