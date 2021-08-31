import express from "express";
import { exportNextOrdersWithRecipesSelectionController } from "../../services/exportNextOrdersWithRecipesSelection";
import { chooseRecipesForOrderController } from "../../useCases/chooseRecipesForOrder";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getNextOrdersBySubscriptionController } from "../../useCases/getNextOrdersBySubscription";
import { getOrderByIdController } from "../../useCases/getOrderById";
import { skipOrdersController } from "../../useCases/skipOrders";

const orderRouter = express.Router();

// GETs
orderRouter.get("/", (req, res) => res.json({}));
orderRouter.get("/export-next-with-recipes-selection", (req, res) => exportNextOrdersWithRecipesSelectionController.execute(req, res));
orderRouter.get("/by-subscription/:subscriptionId", (req, res) => getNextOrdersBySubscriptionController.execute(req, res));
orderRouter.get("/:id", (req, res) => getOrderByIdController.execute(req, res));

// POSTs
orderRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs
orderRouter.put("/skip", (req, res) => skipOrdersController.execute(req, res));
orderRouter.put("/update-recipes/:orderId", (req, res) => chooseRecipesForOrderController.execute(req, res));
orderRouter.put("/cancel/:id", (req, res) => res.json({}));

// DELETEs

export { orderRouter };
