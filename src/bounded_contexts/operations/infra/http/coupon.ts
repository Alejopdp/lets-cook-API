import express from "express";
import multer from "multer";
import { createCouponController } from "../../useCases/createCoupon";
import { createCouponControllerCSV } from "../../useCases/createCouponFromCSV";
// import { getAdditionalPlanListController } from "../../useCases/getAdditionalPlanList";
import { getCouponByIdController } from "../../useCases/getCouponById";
import { getCouponListController } from "../../useCases/getCouponList";
import { getCouponValidationController } from "../../useCases/couponValidation";
import { updateCouponStateController } from "../../useCases/updateCouponState";

const couponRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
couponRouter.get("/", (req, res) => getCouponListController.execute(req, res));
couponRouter.get("/:id", (req, res) => getCouponByIdController.execute(req, res));
couponRouter.get("/validation/:code", (req, res) => getCouponValidationController.execute(req, res));

// // PUT
couponRouter.put("/:id", multer(options).single(""), (req, res) => updateCouponStateController.execute(req, res));

// POSTs
couponRouter.post("/", multer(options).single(""), (req, res) => createCouponController.execute(req, res));
couponRouter.post("/import", multer(options).single("coupons"), (req, res) => createCouponControllerCSV.execute(req, res));

export { couponRouter };
