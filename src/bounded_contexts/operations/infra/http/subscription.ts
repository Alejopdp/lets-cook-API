import express from "express";
import { cancelASubscriptionController } from "../../useCases/cancelASubscription";
import { createManySubscriptionsController } from "../../useCases/createManySubscriptions";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getCustomerSusbcriptionsController } from "../../useCases/getCustomerSubscriptions";
import { getSubscriptionByIdController } from "../../useCases/getSubscriptionById";
import { reorderPlanController } from "../../useCases/reorderPlan";
import { swapSubscriptionPlanController } from "../../useCases/swapSubscriptionPlan";

const subscriptionRouter = express.Router();

// GETs
subscriptionRouter.get("/", (req, res) => res.json({}));
subscriptionRouter.get("/by-customer/:customerId", (req, res) => getCustomerSusbcriptionsController.execute(req, res));
subscriptionRouter.get("/:id", (req, res) => getSubscriptionByIdController.execute(req, res));

// POSTs
subscriptionRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));
subscriptionRouter.post("/many", (req, res) => createManySubscriptionsController.execute(req, res));
subscriptionRouter.post("/reorder/:subscriptionId", (req, res) => reorderPlanController.execute(req, res))

// PUTs
subscriptionRouter.put("/cancel/:id", (req, res) => cancelASubscriptionController.execute(req, res));
subscriptionRouter.put("/swap-plan/:id", (req, res) => swapSubscriptionPlanController.execute(req, res));

// DELETEs

export { subscriptionRouter };
