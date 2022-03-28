import express from "express";
import multer from "multer";
import { createShippingZoneController } from "../../useCases/createShippingZone";
import { getShippingListController } from "../../useCases/getShippingZoneList/index";
import { getShippingZoneByIdController } from "../../useCases/getShippingZoneById";
import { deleteShippingZoneController } from "../../useCases/deleteShippingZone";
import { updateShippingZoneController } from "../../useCases/updateShippingZone";
import { updateShippingZoneStateController } from "../../useCases/updateShippingZoneState";
import { getShippingRateController } from "../../useCases/getShippingRate";
import { middleware } from "../../../../shared/middleware";
import { Permission } from "../../../../bounded_contexts/IAM/domain/permission/Permission";

const shippingRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
shippingRouter.get("/", middleware.ensureAdminAuthenticated([Permission.VIEW_SHIPPING_ZONE]), (req, res) =>
    getShippingListController.execute(req, res)
);
shippingRouter.get("/shipping-rate/:latitude/:longitude", middleware.addCurrentUser(), (req, res) =>
    getShippingRateController.execute(req, res)
);

shippingRouter.get("/:id", middleware.ensureAdminAuthenticated([Permission.VIEW_SHIPPING_ZONE]), (req, res) =>
    getShippingZoneByIdController.execute(req, res)
);

// // PUT
shippingRouter.put("/toggle-state/:id", middleware.ensureAdminAuthenticated([Permission.UPDATE_SHIPPING_ZONE]), (req, res) =>
    updateShippingZoneStateController.execute(req, res)
);
shippingRouter.put(
    "/:id",
    [multer(options).single("map"), middleware.ensureAdminAuthenticated([Permission.UPDATE_SHIPPING_ZONE])],
    (req: any, res: any) => updateShippingZoneController.execute(req, res)
);

// POSTs
shippingRouter.post(
    "/",
    [multer(options).single("map"), middleware.ensureAdminAuthenticated([Permission.CREATE_SHIPPING_ZONE])],
    (req: any, res: any) => createShippingZoneController.execute(req, res)
);

// // DELETEs
shippingRouter.delete("/:id", middleware.ensureAdminAuthenticated([Permission.DELETE_SHIPPING_ZONE]), (req, res) =>
    deleteShippingZoneController.execute(req, res)
);

export { shippingRouter };
