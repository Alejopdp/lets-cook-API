import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetCustomerList } from "./getCustomerList";
import { GetCustomerListController } from "./getCustomerListController";

export const getCustomerList = new GetCustomerList(
    mongooseCustomerRepository,
    mongooseSubscriptionRepository,
    s3Service,
    mongooseOrderRepository
);
export const getCustomerListController = new GetCustomerListController(getCustomerList);
