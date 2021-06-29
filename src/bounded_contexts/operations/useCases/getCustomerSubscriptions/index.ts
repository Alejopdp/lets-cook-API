import { s3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetCustomerSubscriptions } from "./getCustomerSubscriptions";
import { GetCustomersubscriptionsController } from "./getCustomerSubscriptionsController";
import { GetCustomerSubscriptionsPresenter } from "./getCustomerSubscriptionsPresenter";

export const getCustomerSubscriptions: GetCustomerSubscriptions = new GetCustomerSubscriptions(
    mongooseSubscriptionRepository,
    mongooseOrderRepository
);

export const getCustomerSubscriptionsPresenter: GetCustomerSubscriptionsPresenter = new GetCustomerSubscriptionsPresenter(s3Service);
export const getCustomerSusbcriptionsController: GetCustomersubscriptionsController = new GetCustomersubscriptionsController(
    getCustomerSubscriptions,
    getCustomerSubscriptionsPresenter
);
