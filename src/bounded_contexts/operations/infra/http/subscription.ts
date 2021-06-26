import express from "express";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getCustomerSusbcriptionsController } from "../../useCases/getCustomerSubscriptions";
import { getSubscriptionByIdController } from "../../useCases/getSubscriptionById";

const subscriptionRouter = express.Router();

// GETs
subscriptionRouter.get("/", (req, res) => res.json({}));
subscriptionRouter.get("/by-customer/:customerId", (req, res) => getCustomerSusbcriptionsController.execute(req, res));
subscriptionRouter.get("/:id", (req, res) => getSubscriptionByIdController.execute(req, res));

// POSTs
subscriptionRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs

// DELETEs

export { subscriptionRouter };
