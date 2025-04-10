import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { GetCustomerByName } from "./getCustomerByName";
import { GetCustomerByNameController } from "./getCustomerByNameController";

export const getCustomerByName = new GetCustomerByName(mongooseCustomerRepository, v3S3Service);
export const getCustomerByNameController = new GetCustomerByNameController(getCustomerByName);
