import { Permission } from "../../../../bounded_contexts/IAM/domain/permission/Permission";
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
orderRouter.get(
    "/export-next-with-recipes-selection-filters",
    middleware.ensureAdminAuthenticated([Permission.EXPORT_RECIPE_SELECTION]),
    (req, res) => getNextOrdersWithRecipesSelectionExportFiltersController.execute(req, res)
);
orderRouter.get("/by-subscription/:subscriptionId", middleware.ensureAdminAuthenticated([Permission.VIEW_ORDERS]), (req, res) =>
    getNextOrdersBySubscriptionController.execute(req, res)
);
orderRouter.get("/:id", middleware.ensureAdminAuthenticated([Permission.VIEW_ORDERS]), (req, res) =>
    getOrderByIdController.execute(req, res)
);

// POSTs
orderRouter.post(
    "/export-next-with-recipes-selection",
    middleware.ensureAdminAuthenticated([Permission.EXPORT_RECIPE_SELECTION]),
    (req, res) => exportNextOrdersWithRecipesSelectionController.execute(req, res)
);
orderRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs
orderRouter.put("/skip", middleware.ensureAuthenticated(), (req, res) => skipOrdersController.execute(req, res));
orderRouter.put("/cancel/:id", middleware.ensureAdminAuthenticated([Permission.UPDATE_ORDER]), (req, res) => res.json({}));
orderRouter.put(
    "/update-recipes",
    [multer(options).single("recipeSelection"), middleware.ensureAdminAuthenticated([Permission.UPDATE_RECIPE])],
    (req: any, res: any) => chooseRecipesForManyOrdersController.execute(req, res)
);
orderRouter.put("/update-recipes/:orderId", middleware.ensureAuthenticated(), (req, res) =>
    chooseRecipesForOrderController.execute(req, res)
);
orderRouter.put("/move-shipping-date/:orderId", middleware.ensureAuthenticated(), (req, res) =>
    moveOrderShippingDateController.execute(req, res)
);

// DELETEs

export { orderRouter };
