import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdateCustomerInfo } from "./updateCustomerInfo";
import { UpdateCustomerInfoController } from "./updateCustomerInfoController";

export const updateCustomerInfo: UpdateCustomerInfo = new UpdateCustomerInfo(mongooseCustomerRepository, v3S3Service);
export const updateCustomerInfoController = new UpdateCustomerInfoController(updateCustomerInfo);
