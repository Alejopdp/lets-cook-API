import express from "express";
import multer from "multer";
import { createCouponController } from "../../useCases/createCoupon";
// import { deletePlanController } from "../../useCases/deletePlan";
// import { getAdditionalPlanListController } from "../../useCases/getAdditionalPlanList";
import { getCouponByIdController } from "../../useCases/getCouponById";
import { getCouponListController } from "../../useCases/getCouponList";
// import { togglePlanStateController } from "../../useCases/togglePlanState";
import { updateCouponStateController } from "../../useCases/updateCouponState";

const couponRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
couponRouter.get("/", (req, res) => getCouponListController.execute(req, res));
// planRouter.get("/additionals", (req, res) => getAdditionalPlanListController.execute(req, res));
couponRouter.get("/:id", (req, res) => getCouponByIdController.execute(req, res));

// // PUT
// planRouter.put("/toggle-state/:id", (req, res) => togglePlanStateController.execute(req, res));
couponRouter.put("/:id", multer(options).single(""), (req, res) => updateCouponStateController.execute(req, res));

// POSTs
couponRouter.post("/", multer(options).single(""), (req, res) => createCouponController.execute(req, res));

// // DELETEs
// planRouter.delete("/:id", (req, res) => deletePlanController.execute(req, res));

export { couponRouter };
