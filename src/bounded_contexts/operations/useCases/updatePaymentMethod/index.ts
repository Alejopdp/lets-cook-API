import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdatePaymentMethod } from "./updatePaymentMethod";
import { UpdatePaymentMethodController } from "./updatePaymentMethodController";

export const updatePaymentMethod: UpdatePaymentMethod = new UpdatePaymentMethod(mongooseCustomerRepository, s3Service);
export const updatePaymentMethodController = new UpdatePaymentMethodController(updatePaymentMethod);
