import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { GetCustomerList } from "./getCustomerList";
import { GetCustomerListController } from "./getCustomerListController";

export const getCustomerList = new GetCustomerList(mongooseCustomerRepository, s3Service);
export const getCustomerListController = new GetCustomerListController(getCustomerList);
