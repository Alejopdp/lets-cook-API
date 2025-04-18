import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { UpdatePaymentMethod } from "./updatePaymentMethod";
import { UpdatePaymentMethodController } from "./updatePaymentMethodController";

export const updatePaymentMethod: UpdatePaymentMethod = new UpdatePaymentMethod(
    mongooseCustomerRepository,
    v3S3Service,
    mongooseLogRepository
);
export const updatePaymentMethodController = new UpdatePaymentMethodController(updatePaymentMethod);
