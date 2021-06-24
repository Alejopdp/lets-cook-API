import express from "express";
import { createSubscriptionController } from "../../useCases/createSubscription";

const subscriptionRouter = express.Router();

// GETs

// POSTs
subscriptionRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs

// DELETEs

export { subscriptionRouter };
