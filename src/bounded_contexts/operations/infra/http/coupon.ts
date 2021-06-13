import express from "express";
import multer from "multer";
import { createCouponController } from "../../useCases/createCoupon";
import { getCouponByIdController } from "../../useCases/getCouponById";
import { getCouponListController } from "../../useCases/getCouponList";
import { updateCouponStateController } from "../../useCases/updateCouponState";

const couponRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
couponRouter.get("/", (req, res) => getCouponListController.execute(req, res));
couponRouter.get("/:id", (req, res) => getCouponByIdController.execute(req, res));

// // PUT
couponRouter.put("/:id", multer(options).single(""), (req, res) => updateCouponStateController.execute(req, res));

// POSTs
couponRouter.post("/", multer(options).single(""), (req, res) => createCouponController.execute(req, res));

export { couponRouter };
