import express from "express";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getNextOrdersBySubscriptionController } from "../../useCases/getNextOrdersBySubscription";
import { skipOrdersController } from "../../useCases/skipOrders";

const orderRouter = express.Router();

// GETs
orderRouter.get("/", (req, res) => res.json({}));
orderRouter.get("/by-subscription/:subscriptionId", (req, res) => getNextOrdersBySubscriptionController.execute(req, res));
orderRouter.get("/:id}", (req, res) => res.json({}));

// POSTs
orderRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs
orderRouter.put("/skip", (req, res) => skipOrdersController.execute(req, res));

// DELETEs

export { orderRouter };
