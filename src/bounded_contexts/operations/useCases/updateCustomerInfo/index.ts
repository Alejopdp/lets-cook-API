import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdateCustomerInfo } from "./updateCustomerInfo";
import { UpdateCustomerInfoController } from "./updateCustomerInfoController";

export const updateCustomerInfo: UpdateCustomerInfo = new UpdateCustomerInfo(mongooseCustomerRepository, s3Service);
export const updateCustomerInfoController = new UpdateCustomerInfoController(updateCustomerInfo);
