import express from "express";
import multer from "multer";
import { middleware } from "../../../../shared/middleware";
import { exportNextOrdersWithRecipesSelectionController } from "../../services/exportNextOrdersWithRecipesSelection";
import { chooseRecipesForManyOrdersController } from "../../useCases/chooseRecipesForManyOrders";
import { chooseRecipesForOrderController } from "../../useCases/chooseRecipesForOrder";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getNextOrdersBySubscriptionController } from "../../useCases/getNextOrdersBySubscription";
import { getNextOrdersWithRecipesSelectionExportFiltersController } from "../../useCases/getNextOrdersWithRecipesSelectionExportFilters";
import { getOrderByIdController } from "../../useCases/getOrderById";
import { moveOrderShippingDateController } from "../../useCases/moveOrderShippingDate";
import { skipOrdersController } from "../../useCases/skipOrders";

const options: multer.Options = {
    dest: "/tmp",
};

const orderRouter = express.Router();

// GETs
orderRouter.get("/", (req, res) => res.json({}));
orderRouter.get("/export-next-with-recipes-selection-filters", (req, res) =>
    getNextOrdersWithRecipesSelectionExportFiltersController.execute(req, res)
);
orderRouter.get("/by-subscription/:subscriptionId", (req, res) => getNextOrdersBySubscriptionController.execute(req, res));
orderRouter.get("/:id", (req, res) => getOrderByIdController.execute(req, res));

// POSTs
orderRouter.post("/export-next-with-recipes-selection", (req, res) => exportNextOrdersWithRecipesSelectionController.execute(req, res));
orderRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs
orderRouter.put("/skip", middleware.ensureAuthenticated(), (req, res) => skipOrdersController.execute(req, res));
orderRouter.put("/cancel/:id", (req, res) => res.json({}));
orderRouter.put("/update-recipes", multer(options).single("recipeSelection"), (req, res) =>
    chooseRecipesForManyOrdersController.execute(req, res)
);
orderRouter.put("/update-recipes/:orderId", middleware.ensureAuthenticated(), (req, res) =>
    chooseRecipesForOrderController.execute(req, res)
);
orderRouter.put("/move-shipping-date/:orderId", (req, res) => moveOrderShippingDateController.execute(req, res));

// DELETEs

export { orderRouter };
