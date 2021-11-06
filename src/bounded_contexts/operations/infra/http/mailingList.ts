import express from "express";
import { subscribeToMailingListGroupController } from "../../useCases/subscribeToMailingListGroup";
import { updateMailingListSubscriberControlelr } from "../../useCases/updateMailingListSubscriber";

const mailingListRouter = express.Router();

// PUT
mailingListRouter.put("/update-subscriber/:subscriberEmail", (req, res) => updateMailingListSubscriberControlelr.execute(req, res));

// POSTs
mailingListRouter.post("/subscribe-to-group/:groupId", (req, res) => subscribeToMailingListGroupController.execute(req, res));

export { mailingListRouter };
