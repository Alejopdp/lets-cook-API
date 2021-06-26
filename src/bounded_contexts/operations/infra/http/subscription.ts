import express from "express";
import { cancelASubscriptionController } from "../../useCases/cancelASubscription";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getCustomerSusbcriptionsController } from "../../useCases/getCustomerSubscriptions";
import { getSubscriptionByIdController } from "../../useCases/getSubscriptionById";
import { swapSubscriptionPlanController } from "../../useCases/swapSubscriptionPlan";

const subscriptionRouter = express.Router();

// GETs
subscriptionRouter.get("/", (req, res) => res.json({}));
subscriptionRouter.get("/by-customer/:customerId", (req, res) => getCustomerSusbcriptionsController.execute(req, res));
subscriptionRouter.get("/:id", (req, res) => getSubscriptionByIdController.execute(req, res));

// POSTs
subscriptionRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs
subscriptionRouter.put("/cancel/:id", (req, res) => cancelASubscriptionController.execute(req, res));
subscriptionRouter.put("/swap-plan/:id", (req, res) => swapSubscriptionPlanController.execute(req, res));

// DELETEs

export { subscriptionRouter };
