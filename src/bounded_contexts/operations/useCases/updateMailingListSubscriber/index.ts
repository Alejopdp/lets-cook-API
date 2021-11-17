import { mailerLiteService } from "../../application/mailingListService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdateMailingListSubscriber } from "./updateMailingListSubscriber";
import { UpdateMailingListSubscriberController } from "./updateMailingListSubscriberController";

export const updateMailingListSubscriber: UpdateMailingListSubscriber = new UpdateMailingListSubscriber(
    mongooseCustomerRepository,
    mailerLiteService
);
export const updateMailingListSubscriberControlelr: UpdateMailingListSubscriberController = new UpdateMailingListSubscriberController(
    updateMailingListSubscriber
);
