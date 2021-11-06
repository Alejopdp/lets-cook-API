import { mailerLiteService } from "../../application/mailingListService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { SubscribeToMailingListGroup } from "./subscribeToMailingListGroup";
import { SubscribeToMailingListGroupController } from "./subscribeToMailingListGroupController";

export const subscribeToMailingListGroup: SubscribeToMailingListGroup = new SubscribeToMailingListGroup(
    mongooseCustomerRepository,
    mailerLiteService
);
export const subscribeToMailingListGroupController: SubscribeToMailingListGroupController = new SubscribeToMailingListGroupController(
    subscribeToMailingListGroup
);
