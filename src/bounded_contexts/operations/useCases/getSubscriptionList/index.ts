import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetSubscriptionList } from "./getSubscriptionList";
import { GetSubscriptionListController } from "./getSubscriptionListController";
import { GetSubscriptionListPresenter } from "./getSubscriptionListPresenter";

export const getSubscriptionList: GetSubscriptionList = new GetSubscriptionList(mongooseSubscriptionRepository);
export const getSubscriptionListPresenter: GetSubscriptionListPresenter = new GetSubscriptionListPresenter();
export const getSubscriptionListController: GetSubscriptionListController = new GetSubscriptionListController(
    getSubscriptionList,
    getSubscriptionListPresenter
);
