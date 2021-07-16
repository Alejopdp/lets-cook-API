import express from "express";
import multer from "multer";
import { createShippingZoneController } from "../../useCases/createShippingZone";
import { getShippingListController } from "../../useCases/getShippingZoneList/index";
import { getShippingZoneByIdController } from "../../useCases/getShippingZoneById";
import { deleteShippingZoneController } from "../../useCases/deleteShippingZone";
import { updateShippingZoneController } from "../../useCases/updateShippingZone";
import { updateShippingZoneStateController } from "../../useCases/updateShippingZoneState";
import { getShippingRateController } from "../../useCases/getShippingRate";

const shippingRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
shippingRouter.get("/", (req, res) => getShippingListController.execute(req, res));
shippingRouter.get("/shipping-rate/:latitude/:longitude", (req, res) => getShippingRateController.execute(req, res));

shippingRouter.get("/:id", (req, res) => getShippingZoneByIdController.execute(req, res));

// // PUT
shippingRouter.put("/toggle-state/:id", (req, res) => updateShippingZoneStateController.execute(req, res));
shippingRouter.put("/:id", multer(options).single("map"), (req, res) => updateShippingZoneController.execute(req, res));

// POSTs
shippingRouter.post("/", multer(options).single("map"), (req, res) => createShippingZoneController.execute(req, res));

// // DELETEs
shippingRouter.delete("/:id", (req, res) => deleteShippingZoneController.execute(req, res));

export { shippingRouter };
